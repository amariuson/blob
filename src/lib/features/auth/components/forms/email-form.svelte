<script lang="ts">
	import Button from '$lib/shared/components/ui/button/button.svelte';
	import Input from '$lib/shared/components/ui/input/input.svelte';
	import Label from '$lib/shared/components/ui/label/label.svelte';
	import Spinner from '$lib/shared/components/ui/spinner/spinner.svelte';
	import { formHandler } from '$lib/shared/form/form-handler.svelte';

	import { sendEmailOTPForm } from '../../remote';

	type Props = {
		setEmail: (email: string) => void;
	};

	const { setEmail }: Props = $props();
</script>

<form
	class="space-y-6"
	{...formHandler(sendEmailOTPForm, {
		onSuccess({ inputData }) {
			setEmail(inputData.email);
		}
	})}
>
	<div class="space-y-2">
		<Label for="email" class="block text-sm">Email</Label>
		<Input required name="email" id="email" />
		<div class="my-2 space-y-2">
			{#each sendEmailOTPForm.fields.email.issues() as issue (issue.message)}
				<p class="text-sm text-red-500">{issue.message}</p>
			{/each}
		</div>
	</div>
	<Button class="w-full" type="submit" disabled={!!sendEmailOTPForm.pending}>
		{#if !!sendEmailOTPForm.pending}
			<Spinner class="mr-2" />
		{/if}
		Continue
	</Button>
</form>
