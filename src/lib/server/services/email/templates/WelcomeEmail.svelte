<script lang="ts">
	import { Button, Heading, Section, Text } from 'better-svelte-email';

	import BaseLayout from '../components/BaseLayout.svelte';

	let { userName = 'there' }: { userName?: string } = $props();
</script>

<BaseLayout preview="Welcome to Blob - let's get started">
	<Heading as="h1" class="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
		Welcome to <strong>Blob</strong>
	</Heading>

	<Text class="text-[14px] leading-[24px] text-black">Hello {userName},</Text>

	<Text class="text-[14px] leading-[24px] text-black">
		We're excited to have you on board. Blob is your workspace for seamless collaboration and
		productivity.
	</Text>

	<Text class="text-[14px] leading-[24px] text-black">
		Get started by exploring your dashboard and setting up your first project.
	</Text>

	<Section class="mt-[32px] mb-[32px] text-center">
		<Button
			href="https://blob.is"
			class="rounded bg-[#000000] px-5 py-3 text-center text-[12px] font-semibold text-white no-underline"
		>
			Get Started
		</Button>
	</Section>

	<Text class="text-[12px] leading-[24px] text-[#666666]">
		If you have any questions or need help getting started, feel free to reach out to our support
		team. We're here to help you succeed.
	</Text>
</BaseLayout>
