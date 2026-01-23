<script lang="ts" module>
	import type { WithChildren, WithoutChildren } from 'bits-ui';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
	import type { VariantProps } from 'tailwind-variants';

	export type ButtonVariant = VariantProps<typeof buttonVariants>['variant'];
	export type ButtonSize = VariantProps<typeof buttonVariants>['size'];

	export type ButtonPropsWithoutHTML = WithChildren<{
		ref?: HTMLElement | null;
		variant?: ButtonVariant;
		size?: ButtonSize;
		loading?: boolean;
		onClickPromise?: (
			e: MouseEvent & {
				currentTarget: EventTarget & HTMLButtonElement;
			}
		) => Promise<void>;
	}>;

	export type AnchorElementProps = ButtonPropsWithoutHTML &
		WithoutChildren<Omit<HTMLAnchorAttributes, 'href' | 'type'>> & {
			href: HTMLAnchorAttributes['href'];
			type?: never;
			disabled?: HTMLButtonAttributes['disabled'];
		};

	export type ButtonElementProps = ButtonPropsWithoutHTML &
		WithoutChildren<Omit<HTMLButtonAttributes, 'type' | 'href'>> & {
			type?: HTMLButtonAttributes['type'];
			href?: never;
			disabled?: HTMLButtonAttributes['disabled'];
		};

	export type ButtonProps = AnchorElementProps | ButtonElementProps;
</script>

<script lang="ts">
	import { cn } from '$lib/shared/utils.js';
	import LoaderCircleIcon from '@lucide/svelte/icons/loader-circle';
	import { buttonVariants } from '../button/index.js';

	let {
		ref = $bindable(null),
		variant = 'default',
		size = 'default',
		href = undefined,
		type = 'button',
		loading = false,
		disabled = false,
		tabindex = 0,
		onclick,
		onClickPromise,
		class: className,
		children,
		...rest
	}: ButtonProps = $props();
</script>

<!-- This approach to disabled links is inspired by bits-ui see: https://github.com/huntabyte/bits-ui/pull/1055 -->
<svelte:element
	this={href ? 'a' : 'button'}
	{...rest}
	data-slot="button"
	type={href ? undefined : type}
	href={href && !disabled ? href : undefined}
	disabled={href ? undefined : disabled || loading}
	aria-disabled={href ? disabled : undefined}
	role={href && disabled ? 'link' : undefined}
	tabindex={href && disabled ? -1 : tabindex}
	class={cn(buttonVariants({ variant, size }), className)}
	bind:this={ref}
	onclick={async (
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		e: any
	) => {
		onclick?.(e);

		if (type === undefined) return;

		if (onClickPromise) {
			loading = true;

			await onClickPromise(e);

			loading = false;
		}
	}}
>
	{#if type !== undefined && loading}
		<div class="flex animate-spin place-items-center justify-center">
			<LoaderCircleIcon class="size-4" />
		</div>
		<span class="sr-only">Loading</span>
	{/if}
	{@render children?.()}
</svelte:element>
