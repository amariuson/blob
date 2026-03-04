<script lang="ts">
	import { Button } from '$lib/shared/components/ui/button/index.js';
	import { ButtonGroup } from '$lib/shared/components/ui/button-group/index.js';
	import { Input } from '$lib/shared/components/ui/input/index.js';

	import Example from '../example.svelte';
</script>

<Example title="With Input">
	<div class="flex flex-col gap-4">
		<ButtonGroup>
			<Button variant="outline">Button</Button>
			<Input placeholder="Type something here..." />
		</ButtonGroup>
		<ButtonGroup>
			<Input placeholder="Type something here..." />
			<Button variant="outline">Button</Button>
		</ButtonGroup>
	</div>
</Example>
