<script lang="ts">
	import type { Component, Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	import { cn } from '$lib/shared/utils.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		title: string;
		description?: string;
		icon?: Component<{ class?: string }>;
		iconClass?: string;
		action?: Snippet;
		class?: string;
	}

	let {
		title,
		description,
		icon: Icon,
		iconClass,
		action,
		class: className,
		...restProps
	}: Props = $props();
</script>

<div
	class={cn('flex items-start justify-between gap-4 border-b px-4 py-3', className)}
	{...restProps}
>
	<div class="flex items-center gap-3">
		{#if Icon}
			<div class={cn('flex size-8 shrink-0 items-center justify-center rounded-md', iconClass)}>
				<Icon class="size-4" />
			</div>
		{/if}
		<div class="min-w-0">
			<h3 class="text-sm font-medium">{title}</h3>
			{#if description}
				<p class="text-xs text-muted-foreground">{description}</p>
			{/if}
		</div>
	</div>
	{#if action}
		{@render action()}
	{/if}
</div>
