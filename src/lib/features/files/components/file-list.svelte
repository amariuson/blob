<script lang="ts">
	import { FileX } from '@lucide/svelte';

	import { cn } from '$lib/shared/utils';
	import { Button } from '$lib/shared/components/ui/button';
	import { Spinner } from '$lib/shared/components/ui/spinner';

	import FileItem from './file-item.svelte';
	import type { FileInfo } from '../types';

	interface Props {
		files: FileInfo[];
		loading?: boolean;
		hasMore?: boolean;
		onLoadMore?: () => void;
		onView?: (file: FileInfo) => void;
		onEdit?: (file: FileInfo) => void;
		onDelete?: (file: FileInfo) => void;
		onDownload?: (file: FileInfo) => void;
		emptyMessage?: string;
		class?: string;
	}

	let {
		files,
		loading = false,
		hasMore = false,
		onLoadMore,
		onView,
		onEdit,
		onDelete,
		onDownload,
		emptyMessage = 'No files yet',
		class: className
	}: Props = $props();

	const isEmpty = $derived(files.length === 0 && !loading);
</script>

<div class={cn('space-y-3', className)}>
	{#if isEmpty}
		<div class="flex flex-col items-center justify-center py-12 text-center">
			<div class="rounded-full bg-muted p-4">
				<FileX class="h-8 w-8 text-muted-foreground" />
			</div>
			<p class="mt-4 text-sm text-muted-foreground">{emptyMessage}</p>
		</div>
	{:else}
		{#each files as file (file.id)}
			<FileItem {file} {onView} {onEdit} {onDelete} {onDownload} />
		{/each}

		{#if loading}
			<div class="flex justify-center py-4">
				<Spinner class="h-6 w-6" />
			</div>
		{/if}

		{#if hasMore && !loading}
			<div class="flex justify-center pt-2">
				<Button variant="outline" size="sm" onclick={onLoadMore}>Load more</Button>
			</div>
		{/if}
	{/if}
</div>
