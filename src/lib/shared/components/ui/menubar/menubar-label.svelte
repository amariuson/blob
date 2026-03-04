<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	import { cn } from '$lib/shared/utils.js';

	import { type WithElementRef } from 'bits-ui';

	let {
		ref = $bindable(null),
		inset,
		children,
		class: className,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLElement>> & {
		inset?: boolean;
	} = $props();
</script>

<div
	bind:this={ref}
	data-slot="menubar-label"
	data-inset={inset}
	class={cn('px-1.5 py-1 text-sm font-medium data-inset:pl-8', className)}
	{...restProps}
>
	{@render children?.()}
</div>
