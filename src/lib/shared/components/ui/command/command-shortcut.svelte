<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	import { cn, type WithElementRef } from '$lib/shared/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLSpanElement>> = $props();
</script>

<span
	bind:this={ref}
	data-slot="command-shortcut"
	class={cn(
		'ml-auto text-xs tracking-widest text-muted-foreground group-aria-selected/command-item:text-foreground',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</span>
