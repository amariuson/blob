<script lang="ts">
	import type { Component, Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	import { cn } from '$lib/shared/utils.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		title: string;
		description?: string;
		icon?: Component<{ class?: string }>;
		iconClass?: string;
		children?: Snippet;
		class?: string;
		disabled?: boolean;
	}

	let {
		title,
		description,
		icon: Icon,
		iconClass,
		children,
		class: className,
		disabled = false,
		...restProps
	}: Props = $props();
</script>

<div
	class={cn(
		'flex items-center justify-between gap-4 px-4 py-3 transition-colors',
		disabled ? 'opacity-50' : 'hover:bg-muted/50',
		className
	)}
	{...restProps}
>
	<div class="flex items-center gap-3">
		{#if Icon}
			<div class={cn('flex size-8 shrink-0 items-center justify-center rounded-md', iconClass)}>
				<Icon class="size-4" />
			</div>
		{/if}
		<div class="min-w-0">
			<div class="text-sm font-medium">{title}</div>
			{#if description}
				<p class="text-xs text-muted-foreground">{description}</p>
			{/if}
		</div>
	</div>
	{#if children}
		{@render children()}
	{/if}
</div>
