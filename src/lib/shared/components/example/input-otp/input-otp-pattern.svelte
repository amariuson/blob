<script lang="ts">
	import * as Field from '$lib/shared/components/ui/field/index.js';
	import * as InputOTP from '$lib/shared/components/ui/input-otp/index.js';

	import { REGEXP_ONLY_DIGITS } from 'bits-ui';

	import Example from '../example.svelte';
</script>

<Example title="Digits Only">
	<Field.Field>
		<Field.Label for="digits-only">Digits Only</Field.Label>
		<InputOTP.Root id="digits-only" maxlength={6} pattern={REGEXP_ONLY_DIGITS}>
			{#snippet children({ cells })}
				<InputOTP.Group>
					{#each cells as cell (cell)}
						<InputOTP.Slot {cell} />
					{/each}
				</InputOTP.Group>
			{/snippet}
		</InputOTP.Root>
	</Field.Field>
</Example>
