<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	import { cn } from '$lib/shared/utils.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		children: Snippet;
		class?: string;
	}

	let { children, class: className, ...restProps }: Props = $props();
</script>

<div class={cn('flex items-center justify-end border-t px-4 py-3', className)} {...restProps}>
	{@render children()}
</div>
