<script lang="ts">
	import { toast } from 'svelte-sonner';

	import * as Avatar from '$lib/shared/components/ui/avatar/index.js';
	import { Button, buttonVariants } from '$lib/shared/components/ui/button/index.js';
	import * as ImageCropper from '$lib/shared/components/ui/image-cropper/index.js';
	import {
		cn,
		dataUrlToBlob,
		getInitials,
		IMAGE_UPLOAD_CONFIG,
		validateFile
	} from '$lib/shared/utils';

	import CameraIcon from '@lucide/svelte/icons/camera';
	import LoaderIcon from '@lucide/svelte/icons/loader';
	import TrashIcon from '@lucide/svelte/icons/trash';

	interface Props {
		imageUrl: string | null | undefined;
		cropShape: 'round' | 'rect';
		avatarClass?: string;
		label: string;
		name: string;
		hasCustomImage: boolean;
		getUploadUrl: (data: {
			contentType: 'image/png' | 'image/jpeg' | 'image/webp';
			fileSize: number;
		}) => Promise<{ uploadUrl: string; key: string }>;
		confirmUpload: (data: { key: string }) => Promise<unknown>;
		removeImage: () => Promise<unknown>;
		onSuccess: () => Promise<void>;
	}

	let {
		imageUrl,
		cropShape,
		avatarClass = '',
		label,
		name,
		hasCustomImage,
		getUploadUrl,
		confirmUpload,
		removeImage,
		onSuccess
	}: Props = $props();

	let isUploading = $state(false);
	let isRemoving = $state(false);

	const avatarRounding = $derived(cropShape === 'round' ? 'rounded-full' : 'rounded-lg');
	const overlayRounding = $derived(cropShape === 'round' ? 'rounded-full' : 'rounded-lg');

	async function handleCropped(croppedImageDataUrl: string) {
		isUploading = true;

		try {
			const blob = await dataUrlToBlob(croppedImageDataUrl);
			const contentType = (blob.type || 'image/png') as 'image/png' | 'image/jpeg' | 'image/webp';

			const validation = validateFile(blob, IMAGE_UPLOAD_CONFIG);
			if (!validation.valid) {
				toast.error(validation.error);
				return;
			}

			const { uploadUrl, key } = await getUploadUrl({
				contentType,
				fileSize: blob.size
			});

			const uploadResponse = await fetch(uploadUrl, {
				method: 'PUT',
				body: blob,
				headers: { 'Content-Type': contentType }
			});

			if (!uploadResponse.ok) {
				throw new Error('Failed to upload image');
			}

			await confirmUpload({ key });
			toast.success(`${label} updated`);
			await onSuccess();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Failed to upload image');
		} finally {
			isUploading = false;
		}
	}

	async function handleRemove() {
		isRemoving = true;

		try {
			await removeImage();
			toast.success(`${label} removed`);
			await onSuccess();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Failed to remove image');
		} finally {
			isRemoving = false;
		}
	}

	function handleUnsupportedFile() {
		toast.error('Please upload a PNG, JPEG, or WebP image');
	}
</script>

<ImageCropper.Root
	src={imageUrl ?? ''}
	onCropped={handleCropped}
	onUnsupportedFile={handleUnsupportedFile}
	accept="image/png,image/jpeg,image/webp"
>
	<div class="flex items-center gap-4">
		<div class="relative">
			<ImageCropper.Preview>
				{#snippet child({ src })}
					<Avatar.Root class={cn('size-20 shrink-0 shadow-sm ring-2 ring-background', avatarClass)}>
						<Avatar.Image {src} alt={name} class={avatarRounding} />
						<Avatar.Fallback class={cn('text-2xl font-medium', avatarRounding)}>
							{getInitials(name)}
						</Avatar.Fallback>
					</Avatar.Root>
				{/snippet}
			</ImageCropper.Preview>

			<ImageCropper.UploadTrigger>
				<div
					class={cn(
						'absolute inset-0 flex cursor-pointer items-center justify-center bg-black/50 opacity-0 transition-opacity hover:opacity-100',
						overlayRounding
					)}
				>
					<CameraIcon class="size-6 text-white" />
				</div>
			</ImageCropper.UploadTrigger>
		</div>

		<div class="flex flex-col gap-2">
			<p class="text-sm font-medium">{label}</p>
			<div class="flex gap-2">
				<ImageCropper.UploadTrigger>
					<span
						class={cn(
							buttonVariants({ variant: 'outline', size: 'sm' }),
							isUploading && 'pointer-events-none opacity-50'
						)}
					>
						{#if isUploading}
							<LoaderIcon class="size-4 animate-spin" />
							Uploading...
						{:else}
							<CameraIcon class="size-4" />
							Upload
						{/if}
					</span>
				</ImageCropper.UploadTrigger>

				{#if hasCustomImage}
					<Button variant="ghost" size="sm" onclick={handleRemove} disabled={isRemoving}>
						{#if isRemoving}
							<LoaderIcon class="size-4 animate-spin" />
						{:else}
							<TrashIcon class="size-4" />
							Remove
						{/if}
					</Button>
				{/if}
			</div>
			<p class="text-xs text-muted-foreground">PNG, JPG, or WebP. Max 5MB.</p>
		</div>
	</div>

	<ImageCropper.Dialog>
		<div class="h-80">
			<ImageCropper.Cropper aspect={1} {cropShape} />
		</div>
		<ImageCropper.Controls>
			<ImageCropper.Cancel />
			<ImageCropper.Crop />
		</ImageCropper.Controls>
	</ImageCropper.Dialog>
</ImageCropper.Root>
