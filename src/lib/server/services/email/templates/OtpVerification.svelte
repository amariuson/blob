<script lang="ts">
	import { Heading, Section, Text } from 'better-svelte-email';

	import BaseLayout from '../components/BaseLayout.svelte';
	import type { OtpType } from '../types';

	let { otp = '12345678', type = 'sign-in' }: { otp?: string; type?: OtpType } = $props();

	const titles: Record<OtpType, string> = {
		'sign-in': 'Sign in to Blob',
		'email-verification': 'Verify your email',
		'forget-password': 'Reset your password'
	};

	const descriptions: Record<OtpType, string> = {
		'sign-in': 'Enter this code to sign in to your account.',
		'email-verification': 'Enter this code to verify your email address.',
		'forget-password': 'Enter this code to reset your password.'
	};

	const title = $derived(titles[type] || titles['sign-in']);
	const description = $derived(descriptions[type] || descriptions['sign-in']);
</script>

<BaseLayout preview={`Your verification code is ${otp}`}>
	<Heading as="h1" class="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
		{title}
	</Heading>

	<Text class="text-[14px] leading-[24px] text-black">
		{description}
	</Text>

	<Section class="my-[32px] rounded bg-[#f4f4f5] px-[8px] py-[16px] text-center">
		<Text class="m-0 font-mono text-[26px] font-bold tracking-[2px] text-black">
			{otp}
		</Text>
	</Section>

	<Text class="text-[14px] leading-[24px] text-black">
		This code expires in <strong>10 minutes</strong>.
	</Text>

	<Text class="text-[12px] leading-[24px] text-[#666666]">
		If you didn't request this code, you can safely ignore this email. Someone may have entered your
		email address by mistake.
	</Text>
</BaseLayout>
