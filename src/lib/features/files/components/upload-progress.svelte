<script lang="ts">
	import { CheckCircle, XCircle, Loader2, X } from '@lucide/svelte';

	import { cn } from '$lib/shared/utils';
	import { Button } from '$lib/shared/components/ui/button';
	import { Progress } from '$lib/shared/components/ui/progress';

	import { uploadState } from '../state/upload-state.svelte';

	interface Props {
		class?: string;
	}

	let { class: className }: Props = $props();

	const uploads = $derived(Array.from(uploadState.uploads.values()));
	const hasUploads = $derived(uploads.length > 0);

	function getStatusIcon(status: string) {
		switch (status) {
			case 'completed':
				return CheckCircle;
			case 'error':
				return XCircle;
			default:
				return Loader2;
		}
	}

	function getStatusColor(status: string) {
		switch (status) {
			case 'completed':
				return 'text-green-500';
			case 'error':
				return 'text-destructive';
			default:
				return 'text-muted-foreground';
		}
	}
</script>

{#if hasUploads}
	<div class={cn('space-y-2', className)}>
		<div class="flex items-center justify-between">
			<span class="text-sm font-medium">Uploads</span>
			{#if uploadState.completedUploads.length > 0 || uploadState.failedUploads.length > 0}
				<Button
					variant="ghost"
					size="sm"
					class="h-auto px-2 py-1 text-xs"
					onclick={() => {
						uploadState.clearCompleted();
						uploadState.clearFailed();
					}}
				>
					Clear finished
				</Button>
			{/if}
		</div>

		<div class="space-y-2">
			{#each uploads as upload (upload.fileId)}
				{@const StatusIcon = getStatusIcon(upload.status)}
				<div class="flex items-center gap-3 rounded-md border bg-card p-3">
					<StatusIcon
						class={cn(
							'h-4 w-4 flex-shrink-0',
							getStatusColor(upload.status),
							(upload.status === 'uploading' || upload.status === 'confirming') && 'animate-spin'
						)}
					/>

					<div class="min-w-0 flex-1">
						<p class="truncate text-sm font-medium">{upload.fileName}</p>

						{#if upload.status === 'uploading' || upload.status === 'confirming'}
							<Progress value={upload.progress} class="mt-1 h-1" />
						{:else if upload.status === 'error'}
							<p class="text-xs text-destructive">{upload.error}</p>
						{/if}
					</div>

					<Button
						variant="ghost"
						size="icon"
						class="h-6 w-6 flex-shrink-0"
						onclick={() => uploadState.removeUpload(upload.fileId)}
					>
						<X class="h-3 w-3" />
						<span class="sr-only">Remove</span>
					</Button>
				</div>
			{/each}
		</div>
	</div>
{/if}
