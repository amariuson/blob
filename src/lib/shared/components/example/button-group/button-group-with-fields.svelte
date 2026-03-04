<script lang="ts">
	import { Button } from '$lib/shared/components/ui/button/index.js';
	import { ButtonGroup } from '$lib/shared/components/ui/button-group/index.js';
	import * as Field from '$lib/shared/components/ui/field/index.js';
	import * as InputGroup from '$lib/shared/components/ui/input-group/index.js';
	import { Label } from '$lib/shared/components/ui/label/index.js';

	import MinusIcon from '@lucide/svelte/icons/minus';
	import PlusIcon from '@lucide/svelte/icons/plus';

	import Example from '../example.svelte';
</script>

<Example title="With Fields">
	<Field.Group class="grid grid-cols-3 gap-4">
		<Field.Field class="col-span-2">
			<Label for="width">Width</Label>
			<ButtonGroup>
				<InputGroup.Root>
					<InputGroup.Input id="width" />
					<InputGroup.Addon class="text-muted-foreground">W</InputGroup.Addon>
					<InputGroup.Addon align="inline-end" class="text-muted-foreground">px</InputGroup.Addon>
				</InputGroup.Root>
				<Button variant="outline" size="icon">
					<MinusIcon />
				</Button>
				<Button variant="outline" size="icon">
					<PlusIcon />
				</Button>
			</ButtonGroup>
		</Field.Field>
	</Field.Group>
</Example>
