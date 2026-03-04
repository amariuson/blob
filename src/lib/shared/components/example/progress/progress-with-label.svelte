<script lang="ts">
	import * as Field from '$lib/shared/components/ui/field/index.js';
	import { Progress } from '$lib/shared/components/ui/progress/index.js';

	import Example from '../example.svelte';
</script>

<Example title="With Label">
	<Field.Field>
		<Field.Label for="progress-upload">
			<span>Upload progress</span>
			<span class="ml-auto">66%</span>
		</Field.Label>
		<Progress value={66} class="w-full" id="progress-upload" />
	</Field.Field>
</Example>
