<script lang="ts">
	import { cn } from '$lib/shared/utils.js';

	import { ContextMenu as ContextMenuPrimitive } from 'bits-ui';

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: ContextMenuPrimitive.TriggerProps = $props();
</script>

<ContextMenuPrimitive.Trigger
	bind:ref
	data-slot="context-menu-trigger"
	class={cn(' select-none', className)}
	{...restProps}
/>
