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
		userName: string;
		organizationName: string;
		appName: string;
	}

	let { userName, organizationName, appName }: Props = $props();
</script>

<Html>
	<Head />
	<Body class="mx-auto my-auto bg-white px-2 font-sans">
		<Preview preview={`You've been removed from ${organizationName}`} />
		<Container
			class="mx-auto my-[40px] max-w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]"
		>
			<Section class="mt-[32px] text-center">
				<Text class="m-0 text-[20px] font-semibold text-black">{appName}</Text>
			</Section>

			<Heading as="h1" class="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
				You've been removed from <strong>{organizationName}</strong>
			</Heading>

			<Text class="text-[14px] leading-[24px] text-black">Hello {userName},</Text>

			<Text class="text-[14px] leading-[24px] text-black">
				This email is to inform you that you have been removed from the <strong
					>{organizationName}</strong
				>
				team on {appName}.
			</Text>

			<Text class="text-[14px] leading-[24px] text-black">
				Your access to the organization's resources has been revoked. If you believe this was done
				in error, please contact the organization administrator.
			</Text>

			<Text class="text-[12px] leading-[24px] text-[#666666]">
				If you have any questions about this change, please reply to this email or contact our
				support team.
			</Text>

			<Hr class="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />

			<Text class="text-center text-[12px] leading-[24px] text-[#666666]">
				{appName}
			</Text>
		</Container>
	</Body>
</Html>
