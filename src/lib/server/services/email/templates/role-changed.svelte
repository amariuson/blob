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
		oldRole: string;
		newRole: string;
		appName: string;
	}

	let { userName, organizationName, oldRole, newRole, appName }: Props = $props();
</script>

<Html>
	<Head />
	<Body class="mx-auto my-auto bg-white px-2 font-sans">
		<Preview preview={`Your role in ${organizationName} has been updated`} />
		<Container
			class="mx-auto my-[40px] max-w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]"
		>
			<Section class="mt-[32px] text-center">
				<Text class="m-0 text-[20px] font-semibold text-black">{appName}</Text>
			</Section>

			<Heading as="h1" class="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
				Your role has been updated
			</Heading>

			<Text class="text-[14px] leading-[24px] text-black">Hello {userName},</Text>

			<Text class="text-[14px] leading-[24px] text-black">
				Your role in <strong>{organizationName}</strong> has been changed.
			</Text>

			<Section class="my-[24px] rounded bg-[#f4f4f5] py-[16px] text-center">
				<Text class="m-0 text-[14px] text-black">
					<span class="text-[#666666]">{oldRole}</span>
					<span class="mx-2">&rarr;</span>
					<strong>{newRole}</strong>
				</Text>
			</Section>

			<Text class="text-[14px] leading-[24px] text-black">
				Your permissions have been updated to reflect this change. You can continue using {appName}
				with your new role.
			</Text>

			<Text class="text-[12px] leading-[24px] text-[#666666]">
				If you have any questions about your new role or permissions, please contact your
				organization administrator.
			</Text>

			<Hr class="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />

			<Text class="text-center text-[12px] leading-[24px] text-[#666666]">
				{appName}
			</Text>
		</Container>
	</Body>
</Html>
