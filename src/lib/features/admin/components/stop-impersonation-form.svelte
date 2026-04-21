<script lang="ts">
	import { Button } from '$lib/shared/components/ui/button';
	import { Spinner } from '$lib/shared/components/ui/spinner';
	import { formHandler } from '$lib/shared/form/form-handler.svelte';

	import { stopImpersonationForm } from '../admin.remote';
</script>

<form {...formHandler(stopImpersonationForm)}>
	<Button
		type="submit"
		size="sm"
		variant="secondary"
		class="h-7 bg-white text-red-700 hover:bg-red-50"
		disabled={!!stopImpersonationForm.pending}
	>
		{#if !!stopImpersonationForm.pending}
			<Spinner class="mr-1 size-3 animate-spin" />
		{/if}
		Stop Impersonating
	</Button>
</form>
