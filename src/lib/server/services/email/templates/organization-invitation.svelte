<script lang="ts">
	import {
		Body,
		Container,
		Head,
		Heading,
		Hr,
		Html,
		Link,
		Preview,
		Section,
		Text
	} from 'better-svelte-email';

	interface Props {
		inviterName: string;
		inviterEmail: string;
		organizationName: string;
		role: string;
		appName: string;
	}

	let { inviterName, inviterEmail, organizationName, role, appName }: Props = $props();
</script>

<Html>
	<Head />
	<Body class="mx-auto my-auto bg-white px-2 font-sans">
		<Preview preview={`${inviterName} has invited you to join ${organizationName} on ${appName}`} />
		<Container
			class="mx-auto my-[40px] max-w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]"
		>
			<Section class="mt-[32px] text-center">
				<Text class="m-0 text-[20px] font-semibold text-black">{appName}</Text>
			</Section>

			<Heading as="h1" class="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
				Join <strong>{organizationName}</strong> on <strong>{appName}</strong>
			</Heading>

			<Text class="text-[14px] leading-[24px] text-black">Hello,</Text>

			<Text class="text-[14px] leading-[24px] text-black">
				<strong>{inviterName}</strong> (<Link
					href={`mailto:${inviterEmail}`}
					class="text-blue-600 no-underline">{inviterEmail}</Link
				>) has invited you to join the <strong>{organizationName}</strong> team on
				<strong>{appName}</strong> as a <strong>{role}</strong>.
			</Text>

			<Text class="text-[14px] leading-[24px] text-black">
				Sign in to {appName} to accept this invitation.
			</Text>

			<Text class="text-[12px] leading-[24px] text-[#666666]">
				This invitation was intended for you. If you were not expecting this invitation, you can
				ignore this email.
			</Text>

			<Hr class="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />

			<Text class="text-center text-[12px] leading-[24px] text-[#666666]">
				{appName}
			</Text>
		</Container>
	</Body>
</Html>
