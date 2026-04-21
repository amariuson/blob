<script lang="ts">
	import { Button } from '$lib/shared/components/ui/button';
	import { Input } from '$lib/shared/components/ui/input';
	import { Label } from '$lib/shared/components/ui/label';
	import { Spinner } from '$lib/shared/components/ui/spinner';
	import { formHandler } from '$lib/shared/form/form-handler.svelte';

	import { sendEmailOTPForm } from '../../auth.remote';

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
	<Button class="w-full" type="submit" size="lg" disabled={!!sendEmailOTPForm.pending}>
		{#if !!sendEmailOTPForm.pending}
			<Spinner class="mr-2" />
		{/if}
		Continue
	</Button>
</form>
