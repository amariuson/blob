<script lang="ts">
	import * as Field from '$lib/shared/components/ui/field/index.js';
	import * as InputOTP from '$lib/shared/components/ui/input-otp/index.js';

	import Example from '../example.svelte';
</script>

<Example title="Disabled">
	<Field.Field>
		<Field.Label for="disabled">Disabled</Field.Label>
		<InputOTP.Root id="disabled" maxlength={6} disabled value="123456">
			{#snippet children({ cells })}
				<InputOTP.Group>
					{#each cells.slice(0, 3) as cell (cell)}
						<InputOTP.Slot {cell} />
					{/each}
				</InputOTP.Group>
				<InputOTP.Separator />
				<InputOTP.Group>
					{#each cells.slice(3, 6) as cell (cell)}
						<InputOTP.Slot {cell} />
					{/each}
				</InputOTP.Group>
			{/snippet}
		</InputOTP.Root>
	</Field.Field>
</Example>
