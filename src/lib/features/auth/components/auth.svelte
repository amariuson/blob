<script lang="ts">
	import EmailForm from './forms/email-form.svelte';
	import GoogleForm from './forms/google-form.svelte';
	import OtpForm from './forms/otp-form.svelte';

	let email = $state('');
</script>

<GoogleForm />

<div class="my-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
	<hr class="border-dashed" />
	<span class="text-xs text-muted-foreground">Or continue With</span>
	<hr class="border-dashed" />
</div>

{#if email}
	<OtpForm bind:email />
{:else}
	<EmailForm
		setEmail={(value) => {
			email = value;
		}}
	/>
{/if}
