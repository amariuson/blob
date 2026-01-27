<script lang="ts">
	import type { Component, Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	import { cn } from '$lib/shared/utils.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		// Card-level props
		class?: string;
		children: Snippet;

		// Header props (optional - render header section if title is provided)
		title?: string;
		description?: string;
		icon?: Component<{ class?: string }>;
		iconClass?: string;
		action?: Snippet;

		// Content props
		noPadding?: boolean;
		contentClass?: string;

		// Footer props (optional - render footer if provided)
		footer?: Snippet;
		footerClass?: string;
	}

	let {
		children,
		class: className,
		title,
		description,
		icon: Icon,
		iconClass,
		action,
		noPadding = false,
		contentClass,
		footer,
		footerClass,
		...restProps
	}: Props = $props();

	// When using the compound pattern (title provided), wrap content in styled div
	// When using legacy pattern (no title), just pass children through
	const useCompoundContent = $derived(title !== undefined);
</script>

<div class={cn('rounded-lg border bg-card', className)} {...restProps}>
	{#if title}
		<div class="flex items-start justify-between gap-4 border-b px-4 py-3">
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
	{/if}

	{#if useCompoundContent}
		<div class={cn(noPadding ? '' : 'p-4', contentClass)}>
			{@render children()}
		</div>
	{:else}
		{@render children()}
	{/if}

	{#if footer}
		<div class={cn('flex items-center justify-end border-t px-4 py-3', footerClass)}>
			{@render footer()}
		</div>
	{/if}
</div>
