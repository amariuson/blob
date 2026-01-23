<script lang="ts">
	import { Section, Text, Heading } from 'better-svelte-email';
	import BaseLayout from '../components/BaseLayout.svelte';

	let {
		userName = 'there',
		organizationName = 'your organization',
		oldRole = 'member',
		newRole = 'admin'
	}: {
		userName?: string;
		organizationName?: string;
		oldRole?: string;
		newRole?: string;
	} = $props();
</script>

<BaseLayout preview={`Your role in ${organizationName} has been updated`}>
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
		Your permissions have been updated to reflect this change. You can continue using Blob with your
		new role.
	</Text>

	<Text class="text-[12px] leading-[24px] text-[#666666]">
		If you have any questions about your new role or permissions, please contact your organization
		administrator.
	</Text>
</BaseLayout>
