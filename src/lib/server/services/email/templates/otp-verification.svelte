<script lang="ts">
	import {
		Body,
		Container,
		Head,
		Heading,
		Hr,
		Html,
		Preview,
		Section,
		Text
	} from 'better-svelte-email';

	interface Props {
		otp: string;
		type: string;
		appName: string;
	}

	let { otp, type, appName }: Props = $props();

	const titles = $derived<Record<string, string>>({
		'sign-in': `Sign in to ${appName}`,
		'email-verification': 'Verify your email',
		'forget-password': 'Reset your password'
	});

	const descriptions: Record<string, string> = {
		'sign-in': 'Enter this code to sign in to your account.',
		'email-verification': 'Enter this code to verify your email address.',
		'forget-password': 'Enter this code to reset your password.'
	};

	const title = $derived(titles[type] ?? titles['sign-in']);
	const description = $derived(descriptions[type] ?? descriptions['sign-in']);
</script>

<Html>
	<Head />
	<Body class="mx-auto my-auto bg-white px-2 font-sans">
		<Preview preview={`Your ${appName} verification code is ${otp}`} />
		<Container
			class="mx-auto my-[40px] max-w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]"
		>
			<Section class="mt-[32px] text-center">
				<Text class="m-0 text-[20px] font-semibold text-black">{appName}</Text>
			</Section>

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
				If you didn't request this code, you can safely ignore this email. Someone may have entered
				your email address by mistake.
			</Text>

			<Hr class="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />

			<Text class="text-center text-[12px] leading-[24px] text-[#666666]">
				{appName}
			</Text>
		</Container>
	</Body>
</Html>
