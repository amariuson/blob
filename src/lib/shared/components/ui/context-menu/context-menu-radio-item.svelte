<script lang="ts">
	import { cn, type WithoutChild } from '$lib/shared/utils.js';

	import { ContextMenu as ContextMenuPrimitive } from 'bits-ui';
	import CheckIcon from '@lucide/svelte/icons/check';

	let {
		ref = $bindable(null),
		class: className,
		children: childrenProp,
		...restProps
	}: WithoutChild<ContextMenuPrimitive.RadioItemProps> = $props();
</script>

<ContextMenuPrimitive.RadioItem
	bind:ref
	data-slot="context-menu-radio-item"
	class={cn(
		"relative flex cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
		className
	)}
	{...restProps}
>
	{#snippet children({ checked })}
		<span class="pointer-events-none absolute right-2">
			{#if checked}
				<CheckIcon />
			{/if}
		</span>
		{@render childrenProp?.({ checked })}
	{/snippet}
</ContextMenuPrimitive.RadioItem>
