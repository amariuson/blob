<script lang="ts">
	import { Button } from '$lib/shared/components/ui/button/index.js';
	import * as Field from '$lib/shared/components/ui/field/index.js';
	import { Input } from '$lib/shared/components/ui/input/index.js';
	import * as Sheet from '$lib/shared/components/ui/sheet/index.js';

	import Example from '../example.svelte';
</script>

<Example title="With Form">
	<Sheet.Root>
		<Sheet.Trigger>
			{#snippet child({ props })}
				<Button variant="outline" {...props}>Open</Button>
			{/snippet}
		</Sheet.Trigger>
		<Sheet.Content>
			<Sheet.Header>
				<Sheet.Title>Edit profile</Sheet.Title>
				<Sheet.Description>
					Make changes to your profile here. Click save when you&apos;re done.
				</Sheet.Description>
			</Sheet.Header>
			<div class="style-vega:px-4 style-maia:px-6 style-mira:px-6 style-lyra:px-4 style-nova:px-4">
				<Field.Group>
					<Field.Field>
						<Field.Label for="sheet-demo-name">Name</Field.Label>
						<Input id="sheet-demo-name" value="Pedro Duarte" />
					</Field.Field>
					<Field.Field>
						<Field.Label for="sheet-demo-username">Username</Field.Label>
						<Input id="sheet-demo-username" value="@peduarte" />
					</Field.Field>
				</Field.Group>
			</div>
			<Sheet.Footer>
				<Button type="submit">Save changes</Button>
				<Sheet.Close>
					{#snippet child({ props })}
						<Button variant="outline" {...props}>Close</Button>
					{/snippet}
				</Sheet.Close>
			</Sheet.Footer>
		</Sheet.Content>
	</Sheet.Root>
</Example>
