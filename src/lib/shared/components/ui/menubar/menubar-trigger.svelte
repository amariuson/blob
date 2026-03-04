<script lang="ts">
	import { cn } from '$lib/shared/utils.js';

	import { Menubar as MenubarPrimitive } from 'bits-ui';

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: MenubarPrimitive.TriggerProps = $props();
</script>

<MenubarPrimitive.Trigger
	bind:ref
	data-slot="menubar-trigger"
	class={cn(
		'flex items-center rounded-sm px-1.5 py-px text-sm font-medium outline-hidden select-none hover:bg-muted aria-expanded:bg-muted',
		className
	)}
	{...restProps}
/>
