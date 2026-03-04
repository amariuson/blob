<script lang="ts">
	import { cn } from '$lib/shared/utils.js';

	import { Drawer as DrawerPrimitive } from 'vaul-svelte';

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: DrawerPrimitive.TitleProps = $props();
</script>

<DrawerPrimitive.Title
	bind:ref
	data-slot="drawer-title"
	class={cn('text-base font-medium text-foreground', className)}
	{...restProps}
/>
