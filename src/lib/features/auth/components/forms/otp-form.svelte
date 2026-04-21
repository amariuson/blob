<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { toast } from 'svelte-sonner';

	import { Button } from '$lib/shared/components/ui/button';
	import * as InputOTP from '$lib/shared/components/ui/input-otp';
	import { Label } from '$lib/shared/components/ui/label';
	import { Spinner } from '$lib/shared/components/ui/spinner';
	import { formHandler } from '$lib/shared/form/form-handler.svelte';

	import { REGEXP_ONLY_DIGITS } from 'bits-ui';

	import { signInWithEmailOTPForm } from '../../auth.remote';

	type Props = {
		email: string;
	};

	let { email = $bindable() }: Props = $props();

	const id = $props.id();

	let otp = $state('');
	let otpFormEl = $state<HTMLFormElement>();

	onMount(() => {
		focusOtp();
	});

	const focusOtp = async () => {
		await tick();
		document.getElementById(id)?.focus();
	};

	const resetOtp = async () => {
		otp = '';
		await focusOtp();
	};

	const goBack = () => {
		email = '';
	};
</script>

<form
	class="space-y-6"
	bind:this={otpFormEl}
	{...formHandler(signInWithEmailOTPForm, {
		async onValidationError({ attempt }) {
			if (attempt >= 3) {
				toast.error('Too many attempts, please try again!');
				goBack();
				return;
			}
			await resetOtp();
		}
	})}
>
	<input type="hidden" name="email" value={email} />
	<div class="space-y-2">
		<Label for="otp" class="block text-sm">OTP</Label>
		<InputOTP.Root
			inputId={id}
			name="otp"
			onComplete={() => otpFormEl?.requestSubmit()}
			maxlength={8}
			disabled={!!signInWithEmailOTPForm.pending}
			pattern={REGEXP_ONLY_DIGITS}
			bind:value={otp}
		>
			{#snippet children({ cells })}
				<InputOTP.Group>
					{#each cells as cell (cell)}
						<InputOTP.Slot class="h-9 w-10" {cell} />
					{/each}
				</InputOTP.Group>
			{/snippet}
		</InputOTP.Root>
		<div class="my-2 space-y-2">
			{#each signInWithEmailOTPForm.fields.otp.issues() as issue (issue.message)}
				<p class="text-sm text-red-500">{issue.message}</p>
			{/each}
		</div>
	</div>
	<Button
		class="w-full"
		type="button"
		size="lg"
		variant="outline"
		disabled={!!signInWithEmailOTPForm.pending}
		onclick={goBack}
	>
		{#if !!signInWithEmailOTPForm.pending}
			<Spinner class="mr-2" />
		{/if}
		Go back
	</Button>
</form>
