<script lang="ts">
	import * as AlertDialog from '$lib/shared/components/ui/alert-dialog/index.js';
	import { Button } from '$lib/shared/components/ui/button/index.js';
	import { Spinner } from '$lib/shared/components/ui/spinner/index.js';
	import type { ConfirmDialogProps } from '$lib/shared/form/form-handler.svelte';

	let {
		open = $bindable(false),
		loading = false,
		title,
		description,
		confirmText,
		cancelText,
		variant = 'default',
		onConfirm,
		onCancel,
		content
	}: ConfirmDialogProps = $props();
</script>

<AlertDialog.Root
	bind:open
	onOpenChange={(v) => {
		if (!v && !loading) onCancel();
	}}
>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>{title}</AlertDialog.Title>
			{#if content}
				<AlertDialog.Description>
					{@render content()}
				</AlertDialog.Description>
			{:else}
				<AlertDialog.Description>{description}</AlertDialog.Description>
			{/if}
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel disabled={loading} onclick={onCancel}>{cancelText}</AlertDialog.Cancel>
			<Button
				variant={variant === 'destructive' ? 'destructive' : 'default'}
				disabled={loading}
				onclick={onConfirm}
			>
				{#if loading}
					<Spinner class="mr-2 h-4 w-4" />
				{/if}
				{confirmText}
			</Button>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
