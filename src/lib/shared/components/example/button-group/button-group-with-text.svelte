<script lang="ts">
	import { Button } from '$lib/shared/components/ui/button/index.js';
	import { ButtonGroup, ButtonGroupText } from '$lib/shared/components/ui/button-group/index.js';
	import { Input } from '$lib/shared/components/ui/input/index.js';
	import { Label } from '$lib/shared/components/ui/label/index.js';

	import Example from '../example.svelte';
</script>

<Example title="With Text">
	<div class="flex flex-col gap-4">
		<ButtonGroup>
			<ButtonGroupText>Text</ButtonGroupText>
			<Button variant="outline">Another Button</Button>
		</ButtonGroup>
		<ButtonGroup>
			<ButtonGroupText>
				{#snippet child({ props })}
					<Label for="input-text" {...props}>GPU Size</Label>
				{/snippet}
			</ButtonGroupText>
			<Input id="input-text" placeholder="Type something here..." />
		</ButtonGroup>
	</div>
</Example>
