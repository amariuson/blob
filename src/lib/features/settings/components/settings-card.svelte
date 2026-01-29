<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	import { cn } from '$lib/shared/utils.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		class?: string;
		children: Snippet;
	}

	let { children, class: className, ...restProps }: Props = $props();
</script>

<div class={cn('rounded-lg border bg-card', className)} {...restProps}>
	{@render children()}
</div>
