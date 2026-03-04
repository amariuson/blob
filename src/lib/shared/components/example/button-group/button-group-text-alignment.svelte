<script lang="ts">
	import { Button } from '$lib/shared/components/ui/button/index.js';
	import { ButtonGroup } from '$lib/shared/components/ui/button-group/index.js';
	import * as Field from '$lib/shared/components/ui/field/index.js';
	import { Label } from '$lib/shared/components/ui/label/index.js';

	import Example from '../example.svelte';
</script>

<Example title="Text Alignment">
	<Field.Field>
		<Label id="alignment-label">Text Alignment</Label>
		<ButtonGroup aria-labelledby="alignment-label">
			<Button variant="outline" size="sm">Left</Button>
			<Button variant="outline" size="sm">Center</Button>
			<Button variant="outline" size="sm">Right</Button>
			<Button variant="outline" size="sm">Justify</Button>
		</ButtonGroup>
	</Field.Field>
</Example>
