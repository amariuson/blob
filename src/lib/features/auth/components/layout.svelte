<script lang="ts">
	import type { Snippet } from 'svelte';
	import { PUBLIC_STATIC_URL } from '$env/static/public';

	type Props = {
		heading: string;
		subHeading: string;
		children: Snippet;
		below?: Snippet;
	};

	const { heading, subHeading, children, below }: Props = $props();
</script>

<section class="flex min-h-screen px-4 py-16 md:py-32">
	<div class="m-auto h-fit w-full max-w-92">
		<div class="p-6">
			<div class="mb-8">
				<img src={`${PUBLIC_STATIC_URL}/logo.png`} alt="Blob Logo" class="size-8" />
				<h1 class="mt-4 mb-1 text-xl font-semibold">{heading}</h1>
				<p class="text-muted-foreground">{subHeading}</p>
			</div>
			{@render children()}
		</div>
		{@render below?.()}
	</div>
</section>
