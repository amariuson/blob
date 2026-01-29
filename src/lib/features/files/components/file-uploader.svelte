<script lang="ts">
	import { Upload } from '@lucide/svelte';

	import { cn } from '$lib/shared/utils';
	import { Button } from '$lib/shared/components/ui/button';

	import type { FileVisibility } from '$lib/server/db/schema';

	import { FILE_UPLOAD_CONFIG } from '../constants';
	import { uploadFile, uploadFiles, validateFile, uploadState } from '../state/upload-state.svelte';

	interface Props {
		visibility?: FileVisibility;
		multiple?: boolean;
		onUploadComplete?: (fileIds: string[]) => void;
		onUploadError?: (error: string) => void;
		class?: string;
	}

	let {
		visibility = 'organization',
		multiple = true,
		onUploadComplete,
		onUploadError,
		class: className
	}: Props = $props();

	let isDragging = $state(false);
	let fileInput: HTMLInputElement;

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		isDragging = true;
	}

	function handleDragLeave(e: DragEvent) {
		e.preventDefault();
		isDragging = false;
	}

	async function handleDrop(e: DragEvent) {
		e.preventDefault();
		isDragging = false;

		const files = Array.from(e.dataTransfer?.files ?? []);
		if (files.length === 0) return;

		await handleFiles(files);
	}

	async function handleFileSelect(e: Event) {
		const input = e.target as HTMLInputElement;
		const files = Array.from(input.files ?? []);
		if (files.length === 0) return;

		await handleFiles(files);
		input.value = ''; // Reset input
	}

	async function handleFiles(files: File[]) {
		// Validate all files first
		const invalidFiles: string[] = [];
		const validFiles: File[] = [];

		for (const file of files) {
			const validation = validateFile(file);
			if (validation.valid) {
				validFiles.push(file);
			} else {
				invalidFiles.push(`${file.name}: ${validation.error}`);
			}
		}

		if (invalidFiles.length > 0) {
			onUploadError?.(invalidFiles.join('\n'));
		}

		if (validFiles.length === 0) return;

		if (multiple) {
			const result = await uploadFiles(validFiles, { visibility });
			if (result.successful.length > 0) {
				onUploadComplete?.(result.successful);
			}
			if (result.failed.length > 0) {
				onUploadError?.(`Failed to upload: ${result.failed.join(', ')}`);
			}
		} else {
			const result = await uploadFile({
				file: validFiles[0],
				visibility,
				onError: onUploadError
			});
			if (result.success && result.fileId) {
				onUploadComplete?.([result.fileId]);
			}
		}
	}

	function openFilePicker() {
		fileInput?.click();
	}

	const maxSizeMB = FILE_UPLOAD_CONFIG.maxSizeBytes / (1024 * 1024);
	const isUploading = $derived(uploadState.activeUploads.length > 0);
</script>

<div
	class={cn(
		'relative rounded-lg border-2 border-dashed p-8 text-center transition-colors',
		isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25',
		isUploading && 'pointer-events-none opacity-50',
		className
	)}
	ondragover={handleDragOver}
	ondragleave={handleDragLeave}
	ondrop={handleDrop}
	role="button"
	tabindex="0"
	onkeydown={(e) => e.key === 'Enter' && openFilePicker()}
>
	<input
		bind:this={fileInput}
		type="file"
		{multiple}
		accept={FILE_UPLOAD_CONFIG.allowedTypes.join(',')}
		class="hidden"
		onchange={handleFileSelect}
	/>

	<div class="flex flex-col items-center gap-4">
		<div class="rounded-full bg-muted p-4">
			<Upload class="h-8 w-8 text-muted-foreground" />
		</div>

		<div class="space-y-2">
			<p class="text-sm font-medium">
				{#if isDragging}
					Drop files here
				{:else}
					Drag and drop files here
				{/if}
			</p>
			<p class="text-xs text-muted-foreground">
				or click to browse (max {maxSizeMB}MB per file)
			</p>
		</div>

		<Button variant="outline" size="sm" onclick={openFilePicker} disabled={isUploading}>
			{isUploading ? 'Uploading...' : 'Select Files'}
		</Button>
	</div>
</div>
