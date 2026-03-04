<script lang="ts">
	import CropIcon from '@lucide/svelte/icons/crop';

	import { useImageCropperCrop } from './image-cropper.svelte.js';
	import Button, { type ButtonElementProps } from './image-cropper-button.svelte';

	let {
		ref = $bindable(null),
		variant = 'default',
		size = 'sm',
		onclick,
		...rest
	}: ButtonElementProps = $props();

	const cropState = useImageCropperCrop();
</script>

<Button
	{...rest}
	bind:ref
	{size}
	{variant}
	onclick={(
		e: MouseEvent & {
			currentTarget: EventTarget & HTMLButtonElement;
		}
	) => {
		onclick?.(e);

		cropState.onclick();
	}}
>
	<CropIcon />
	<span>Crop</span>
</Button>
