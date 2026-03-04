<script lang="ts">
	import { Progress } from '$lib/shared/components/ui/progress/index.js';

	import Example from '../example.svelte';
</script>

<Example title="Progress Bar">
	<div class="flex w-full flex-col gap-4">
		<Progress value={0} />
		<Progress value={25} class="w-full" />
		<Progress value={50} />
		<Progress value={75} />
		<Progress value={100} />
	</div>
</Example>
