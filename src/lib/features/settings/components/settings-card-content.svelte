<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	import { cn } from '$lib/shared/utils.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		children: Snippet;
		class?: string;
		noPadding?: boolean;
	}

	let { children, class: className, noPadding = false, ...restProps }: Props = $props();
</script>

<div class={cn(noPadding ? '' : 'p-4', className)} {...restProps}>
	{@render children()}
</div>
