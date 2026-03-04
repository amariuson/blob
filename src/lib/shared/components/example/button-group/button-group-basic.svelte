<script lang="ts">
	import { Button } from '$lib/shared/components/ui/button/index.js';
	import { ButtonGroup } from '$lib/shared/components/ui/button-group/index.js';

	import Example from '../example.svelte';
</script>

<Example title="Basic">
	<div class="flex flex-col gap-4">
		<ButtonGroup>
			<Button variant="outline">Button</Button>
			<Button variant="outline">Another Button</Button>
		</ButtonGroup>
	</div>
</Example>
