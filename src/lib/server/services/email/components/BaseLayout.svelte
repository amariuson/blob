<script lang="ts">
	import { PUBLIC_STATIC_URL } from '$env/static/public';

	import {
		Body,
		Container,
		Head,
		Hr,
		Html,
		Img,
		Preview,
		Section,
		Text	} from 'better-svelte-email';

	let {
		preview = '',
		children
	}: {
		preview?: string;
		children?: import('svelte').Snippet;
	} = $props();
</script>

<Html>
	<Head />
	<Body class="mx-auto my-auto bg-white px-2 font-sans">
		{#if preview}
			<Preview {preview} />
		{/if}
		<Container
			class="mx-auto my-[40px] max-w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]"
		>
			<Section class="mt-[32px]">
				<Img
					src={`${PUBLIC_STATIC_URL}/logo.png`}
					width="40"
					height="40"
					alt="Blob"
					class="mx-auto my-0"
				/>
			</Section>

			{@render children?.()}

			<Hr class="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />

			<Text class="text-center text-[12px] leading-[24px] text-[#666666]">
				Blob - Your workspace for collaboration
			</Text>
		</Container>
	</Body>
</Html>
