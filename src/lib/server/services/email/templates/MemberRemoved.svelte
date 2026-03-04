<script lang="ts">
	import { Heading, Text } from 'better-svelte-email';

	import BaseLayout from '../components/BaseLayout.svelte';

	let {
		userName = 'there',
		organizationName = 'the organization'
	}: {
		userName?: string;
		organizationName?: string;
	} = $props();
</script>

<BaseLayout preview={`You've been removed from ${organizationName}`}>
	<Heading as="h1" class="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
		You've been removed from <strong>{organizationName}</strong>
	</Heading>

	<Text class="text-[14px] leading-[24px] text-black">Hello {userName},</Text>

	<Text class="text-[14px] leading-[24px] text-black">
		This email is to inform you that you have been removed from the <strong
			>{organizationName}</strong
		> team on Blob.
	</Text>

	<Text class="text-[14px] leading-[24px] text-black">
		Your access to the organization's resources has been revoked. If you believe this was done in
		error, please contact the organization administrator.
	</Text>

	<Text class="text-[12px] leading-[24px] text-[#666666]">
		If you have any questions about this change, please reply to this email or contact our support
		team.
	</Text>
</BaseLayout>
