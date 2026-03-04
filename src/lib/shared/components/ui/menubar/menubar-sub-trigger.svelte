<script lang="ts">
	import { cn, type WithoutChild } from '$lib/shared/utils.js';

	import { Menubar as MenubarPrimitive } from 'bits-ui';

	let {
		ref = $bindable(null),
		class: className,
		inset = undefined,
		children,
		...restProps
	}: WithoutChild<MenubarPrimitive.SubTriggerProps> & {
		inset?: boolean;
	} = $props();
</script>

<MenubarPrimitive.SubTrigger
	bind:ref
	data-slot="menubar-sub-trigger"
	data-inset={inset}
	class={cn(
		"gap-1.5 rounded-md px-1.5 py-1 text-sm focus:bg-accent focus:text-accent-foreground data-inset:pl-8 data-open:bg-accent data-open:text-accent-foreground [&_svg:not([class*='size-'])]:size-4",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</MenubarPrimitive.SubTrigger>
