<script lang="ts">
	import { Section, Text, Button, Heading, Link } from 'better-svelte-email';
	import BaseLayout from '../components/BaseLayout.svelte';

	let {
		inviterName = 'John Doe',
		inviterEmail = 'john@example.com',
		organizationName = 'Acme Corp',
		role = 'member',
		inviteLink = 'https://blob.is/sign-in'
	}: {
		inviterName?: string;
		inviterEmail?: string;
		organizationName?: string;
		role?: string;
		inviteLink?: string;
	} = $props();
</script>

<BaseLayout preview={`${inviterName} has invited you to join ${organizationName} on Blob`}>
	<Heading as="h1" class="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
		Join <strong>{organizationName}</strong> on <strong>Blob</strong>
	</Heading>

	<Text class="text-[14px] leading-[24px] text-black">Hello,</Text>

	<Text class="text-[14px] leading-[24px] text-black">
		<strong>{inviterName}</strong> (<Link
			href="mailto:{inviterEmail}"
			class="text-blue-600 no-underline">{inviterEmail}</Link
		>) has invited you to join the <strong>{organizationName}</strong> team on
		<strong>Blob</strong> as a <strong>{role}</strong>.
	</Text>

	<Section class="mt-[32px] mb-[32px] text-center">
		<Button
			href={inviteLink}
			class="rounded bg-[#000000] px-5 py-3 text-center text-[12px] font-semibold text-white no-underline"
		>
			Join the team
		</Button>
	</Section>

	<Text class="text-[14px] leading-[24px] text-black">
		or copy and paste this URL into your browser:
		<Link href={inviteLink} class="text-blue-600 no-underline">{inviteLink}</Link>
	</Text>

	<Text class="text-[12px] leading-[24px] text-[#666666]">
		This invitation was intended for you. If you were not expecting this invitation, you can ignore
		this email. If you are concerned about your account's safety, please reply to this email to get
		in touch with us.
	</Text>
</BaseLayout>
