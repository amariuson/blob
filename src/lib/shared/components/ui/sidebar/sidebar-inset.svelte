<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	import { cn, type WithElementRef } from '$lib/shared/utils.js';

	import { useSidebar } from './context.svelte';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLElement>> = $props();

	const sidebar = useSidebar();
</script>

<main
	bind:this={ref}
	data-slot="sidebar-inset"
	class={cn(
		'relative flex w-full flex-1 flex-col overflow-y-scroll bg-background',
		'md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ms-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ms-2',
		'group-data-[active=true]/banner: max-h-[calc(100svh-var(--banner-height)-4px)]',
		!sidebar.isMobile &&
			'group-data-[active=true]/banner:mr-1 group-data-[active=true]/banner:rounded-r-lg ',

		className
	)}
	{...restProps}
>
	{@render children?.()}
</main>
