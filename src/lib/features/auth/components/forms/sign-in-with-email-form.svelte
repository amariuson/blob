<script lang="ts">
	import Button from '$lib/shared/components/ui/button/button.svelte';
	import Input from '$lib/shared/components/ui/input/input.svelte';
	import Label from '$lib/shared/components/ui/label/label.svelte';
	import * as InputOTP from '$lib/shared/components/ui/input-otp/index';
	import Spinner from '$lib/shared/components/ui/spinner/spinner.svelte';
	import { REGEXP_ONLY_DIGITS } from 'bits-ui';

	import { cn } from '$lib/shared/utils';
	import { tick } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { formHandler } from '$lib/shared/form/form-handler.svelte';
	import { watch } from 'runed';
	import { sendEmailOTPForm, signInWithEmailOTPForm } from '../../remote';

	const id = $props.id();
	let { class: className } = $props();

	let email = $state('');
	let otp = $state('');
	let codeSent = $state(false);
	let otpAttempt = $state(0);
	let otpFormEl = $state<HTMLFormElement>();
	let showErrors = $state(false);

	const isPending = $derived(Boolean(sendEmailOTPForm.pending || signInWithEmailOTPForm.pending));

	watch(
		() => codeSent,
		() => {
			showErrors = false;
		}
	);

	const goBackFromOTPInput = () => {
		codeSent = false;
		otpAttempt = 0;
		otp = '';
	};

	const focusOtp = async () => {
		await tick();
		document.getElementById(id)?.focus();
	};
</script>

<div class={cn(className)}>
	{#if codeSent}
		<form
			class="space-y-6"
			bind:this={otpFormEl}
			{...formHandler(signInWithEmailOTPForm, {
				onValidationError({ issues }) {
					showErrors = true;
					if (issues.some(({ message }) => message.toLowerCase().includes('otp'))) {
						otpAttempt++;
					}
					if (otpAttempt >= 3) {
						toast.error('Too many attempts, please try again!');
						goBackFromOTPInput();
					}
					otp = '';
					focusOtp();
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
					disabled={isPending}
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
				{#if showErrors}
					<div class="my-2 space-y-2">
						{#each signInWithEmailOTPForm.fields.otp.issues() as issue (issue.message)}
							<p class="text-sm text-red-500">{issue.message}</p>
						{/each}
					</div>
				{/if}
			</div>
			<Button
				class="w-full"
				type="button"
				variant="outline"
				disabled={isPending}
				onclick={goBackFromOTPInput}
			>
				{#if isPending}
					<Spinner class="mr-2" />
				{/if}
				Go back
			</Button>
		</form>
	{:else}
		<form
			class="space-y-6"
			{...formHandler(sendEmailOTPForm, {
				onSuccess({ inputData }) {
					email = inputData.email;
					codeSent = true;
					focusOtp();
				},
				onValidationError() {
					showErrors = true;
				}
			})}
		>
			<div class="space-y-2">
				<Label for="email" class="block text-sm">Email</Label>
				<Input required name="email" id="email" />
				{#if showErrors}
					<div class="my-2 space-y-2">
						{#each sendEmailOTPForm.fields.email.issues() as issue (issue.message)}
							<p class="text-sm text-red-500">{issue.message}</p>
						{/each}
					</div>
				{/if}
			</div>
			<Button class="w-full" type="submit" disabled={isPending}>
				{#if isPending}
					<Spinner class="mr-2" />
				{/if}
				Continue
			</Button>
		</form>
	{/if}
</div>
