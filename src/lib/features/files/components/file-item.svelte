<script lang="ts">
	import {
		FileText,
		Image,
		FileSpreadsheet,
		Presentation,
		Archive,
		File,
		MoreVertical,
		Download,
		Trash2,
		Eye,
		Pencil
	} from '@lucide/svelte';

	import { cn } from '$lib/shared/utils';
	import { Button } from '$lib/shared/components/ui/button';
	import * as DropdownMenu from '$lib/shared/components/ui/dropdown-menu';

	import { getFileTypeCategory, getFileTypeLabel, VISIBILITY_LABELS } from '../constants';
	import type { FileInfo } from '../types';

	interface Props {
		file: FileInfo;
		onView?: (file: FileInfo) => void;
		onEdit?: (file: FileInfo) => void;
		onDelete?: (file: FileInfo) => void;
		onDownload?: (file: FileInfo) => void;
		class?: string;
	}

	let { file, onView, onEdit, onDelete, onDownload, class: className }: Props = $props();

	function getFileIcon(contentType: string) {
		const category = getFileTypeCategory(contentType);
		switch (category) {
			case 'image':
				return Image;
			case 'document':
				return FileText;
			case 'spreadsheet':
				return FileSpreadsheet;
			case 'presentation':
				return Presentation;
			case 'archive':
				return Archive;
			default:
				return File;
		}
	}

	function formatFileSize(bytes: number): string {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	}

	function formatDate(date: Date): string {
		return new Intl.DateTimeFormat('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		}).format(date);
	}

	const FileIcon = $derived(getFileIcon(file.contentType));
</script>

<div
	class={cn(
		'flex items-center gap-4 rounded-lg border bg-card p-4 transition-colors hover:bg-accent/50',
		className
	)}
>
	<div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-muted">
		<FileIcon class="h-5 w-5 text-muted-foreground" />
	</div>

	<div class="min-w-0 flex-1">
		<p class="truncate font-medium">{file.name}</p>
		<div class="flex items-center gap-2 text-xs text-muted-foreground">
			<span>{getFileTypeLabel(file.contentType)}</span>
			<span>&middot;</span>
			<span>{formatFileSize(file.size)}</span>
			<span>&middot;</span>
			<span>{formatDate(file.createdAt)}</span>
		</div>
	</div>

	<div class="flex items-center gap-2">
		<span
			class={cn(
				'rounded-full px-2 py-0.5 text-xs font-medium',
				file.visibility === 'public' &&
					'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
				file.visibility === 'organization' &&
					'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
				file.visibility === 'private' &&
					'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
			)}
		>
			{VISIBILITY_LABELS[file.visibility]}
		</span>

		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Button variant="ghost" size="icon" class="h-8 w-8" {...props}>
						<MoreVertical class="h-4 w-4" />
						<span class="sr-only">Open menu</span>
					</Button>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="end">
				{#if onView}
					<DropdownMenu.Item onclick={() => onView(file)}>
						<Eye class="mr-2 h-4 w-4" />
						View
					</DropdownMenu.Item>
				{/if}
				{#if onDownload}
					<DropdownMenu.Item onclick={() => onDownload(file)}>
						<Download class="mr-2 h-4 w-4" />
						Download
					</DropdownMenu.Item>
				{/if}
				{#if onEdit}
					<DropdownMenu.Item onclick={() => onEdit(file)}>
						<Pencil class="mr-2 h-4 w-4" />
						Edit
					</DropdownMenu.Item>
				{/if}
				{#if onDelete}
					<DropdownMenu.Separator />
					<DropdownMenu.Item class="text-destructive" onclick={() => onDelete(file)}>
						<Trash2 class="mr-2 h-4 w-4" />
						Delete
					</DropdownMenu.Item>
				{/if}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
</div>
