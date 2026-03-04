import type { Snippet } from 'svelte';
import { toast } from 'svelte-sonner';
import { isHttpError, isRedirect, type RemoteFormIssue } from '@sveltejs/kit';
import { goto } from '$app/navigation';

// ============================================================================
// Form Handler
// ============================================================================

/** Structural type for RemoteForm - avoids variance issues with full RemoteForm type */
type RemoteFormLike<Input, Output> = {
	readonly result: Output | undefined;
	readonly pending: number;
	readonly fields: {
		allIssues(): RemoteFormIssue[] | undefined;
	};
	enhance(
		callback: (opts: {
			form: HTMLFormElement;
			data: Input;
			submit: () => Promise<void>;
		}) => void | Promise<void>
	): { method: 'POST'; action: string };
};

export type FormEnhanceCallbackParams<Input, Output> = {
	data: Output;
	form: HTMLFormElement;
	inputData: Input;
	attempt: number;
};

export type FormErrorCallbackParams = {
	error: unknown;
	form: HTMLFormElement;
	attempt: number;
};

export type FormValidationErrorCallbackParams = {
	issues: RemoteFormIssue[];
	form: HTMLFormElement;
	attempt: number;
};

export type FormBeforeSubmitCallbackParams<Input> = {
	data: Input;
	form: HTMLFormElement;
	attempt: number;
};

export type FormSettledCallbackParams = {
	form: HTMLFormElement;
	attempt: number;
};

export type FormEnhanceOptions<Input, Output> = {
	beforeSubmit?: (params: FormBeforeSubmitCallbackParams<Input>) => boolean | Promise<boolean>;
	onSuccess?: (params: FormEnhanceCallbackParams<Input, Output>) => void | Promise<void>;
	onValidationError?: (params: FormValidationErrorCallbackParams) => void;
	onError?: (params: FormErrorCallbackParams) => void;
	onSettled?: (params: FormSettledCallbackParams) => void | Promise<void>;
	resetOnSuccess?: boolean;
	fallbackErrorMessage?: string;
};

/**
 * Wrap a remote form with error handling and double-submit prevention.
 *
 * @example
 * ```svelte
 * <form {...formHandler(myForm, {
 *   onSuccess: ({ data }) => toast.success('Saved!')
 * })}>
 * ```
 */
export function formHandler<Input, Output>(
	remoteForm: RemoteFormLike<Input, Output>,
	options: FormEnhanceOptions<Input, Output> = {}
) {
	const {
		beforeSubmit,
		onSuccess,
		onValidationError,
		onError,
		onSettled,
		resetOnSuccess = true,
		fallbackErrorMessage = 'Something went wrong!'
	} = options;

	let attempt = 0;

	return remoteForm.enhance(async ({ submit, form, data }) => {
		if (remoteForm.pending) return;

		attempt++;

		if (beforeSubmit && (await beforeSubmit({ data, form, attempt })) === false) {
			return;
		}

		try {
			await submit();

			const issues = remoteForm.fields.allIssues();
			if (issues?.length) {
				onValidationError?.({ issues, form, attempt });
				return;
			}

			if (resetOnSuccess) form.reset();
			await onSuccess?.({
				data: remoteForm.result as Output,
				form,
				inputData: data,
				attempt
			});
		} catch (err) {
			if (isRedirect(err)) {
				// eslint-disable-next-line svelte/no-navigation-without-resolve
				goto(err.location, { invalidateAll: true });
				return;
			}

			toast.error(isHttpError(err) ? err.body.message : fallbackErrorMessage);
			if (!isHttpError(err)) console.error('Form error:', err);
			onError?.({ error: err, form, attempt });
		} finally {
			await onSettled?.({ form, attempt });
		}
	});
}

// ============================================================================
// Confirmation Dialog
// ============================================================================

export type ConfirmationOptions = {
	title?: string;
	description?: string;
	confirmText?: string;
	cancelText?: string;
	variant?: 'default' | 'destructive';
	/** Async action to run on confirm. Shows loading state while running. */
	onConfirm?: () => Promise<void> | void;
};

export type ConfirmationState = {
	open: boolean;
	loading: boolean;
	title: string;
	description: string;
	confirmText: string;
	cancelText: string;
	variant: 'default' | 'destructive';
	onConfirm: () => void;
	onCancel: () => void;
};

export type ConfirmDialogProps = ConfirmationState & {
	content?: Snippet;
};

/**
 * Create a confirmation dialog.
 *
 * @example
 * ```svelte
 * const confirmation = createConfirmation();
 *
 * // Simple: returns boolean
 * if (await confirmation.confirm({ title: 'Delete?' })) {
 *   await deleteItem();
 * }
 *
 * // With loading: runs action in dialog
 * await confirmation.confirm({
 *   title: 'Delete?',
 *   onConfirm: async () => await deleteItem()
 * });
 *
 * <ConfirmDialog {...confirmation.props} />
 * ```
 */
export function createConfirmation() {
	let resolve: ((v: boolean) => void) | null = null;
	let action: (() => Promise<void> | void) | undefined;

	const defaults = {
		title: 'Are you sure?',
		description: 'This action cannot be undone.',
		confirmText: 'Confirm',
		cancelText: 'Cancel',
		variant: 'default' as const
	};

	const cleanup = () => {
		resolve = null;
		action = undefined;
	};

	const state = $state<ConfirmationState>({
		...defaults,
		open: false,
		loading: false,
		onConfirm: async () => {
			if (action) {
				state.loading = true;
				try {
					await action();
					state.open = false;
					resolve?.(true);
					cleanup();
				} catch (err) {
					// Keep dialog open on error, don't resolve promise yet
					console.error('Confirmation failed:', err);
					state.loading = false;
				}
			} else {
				state.open = false;
				resolve?.(true);
				cleanup();
			}
		},
		onCancel: () => {
			if (state.loading) return;
			state.open = false;
			resolve?.(false);
			cleanup();
		}
	});

	return {
		confirm(options: ConfirmationOptions = {}): Promise<boolean> {
			// Reject previous pending confirmation if any (prevents race condition)
			if (resolve) {
				resolve(false);
				cleanup();
			}

			const { onConfirm, ...rest } = options;
			Object.assign(state, { ...defaults, ...rest, loading: false, open: true });
			action = onConfirm;
			return new Promise((r) => (resolve = r));
		},
		get props() {
			return state;
		}
	};
}
