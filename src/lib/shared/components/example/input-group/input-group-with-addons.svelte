<script lang="ts">
	import * as Field from '$lib/shared/components/ui/field/index.js';
	import * as InputGroup from '$lib/shared/components/ui/input-group/index.js';

	import CopyIcon from '@lucide/svelte/icons/copy';
	import EyeOffIcon from '@lucide/svelte/icons/eye-off';
	import InfoIcon from '@lucide/svelte/icons/info';
	import MicIcon from '@lucide/svelte/icons/mic';
	import RadioIcon from '@lucide/svelte/icons/radio';
	import SearchIcon from '@lucide/svelte/icons/search';
	import StarIcon from '@lucide/svelte/icons/star';

	import Example from '../example.svelte';
</script>

<Example title="With Addons">
	<Field.Group>
		<Field.Field>
			<Field.Label for="input-icon-left-05">Addon (inline-start)</Field.Label>
			<InputGroup.Root>
				<InputGroup.Input id="input-icon-left-05" />
				<InputGroup.Addon>
					<SearchIcon class="text-muted-foreground" />
				</InputGroup.Addon>
			</InputGroup.Root>
		</Field.Field>
		<Field.Field>
			<Field.Label for="input-icon-right-07">Addon (inline-end)</Field.Label>
			<InputGroup.Root>
				<InputGroup.Input id="input-icon-right-07" />
				<InputGroup.Addon align="inline-end">
					<EyeOffIcon />
				</InputGroup.Addon>
			</InputGroup.Root>
		</Field.Field>
		<Field.Field>
			<Field.Label for="input-icon-both-09">Addon (inline-start and inline-end)</Field.Label>
			<InputGroup.Root>
				<InputGroup.Input id="input-icon-both-09" />
				<InputGroup.Addon>
					<MicIcon class="text-muted-foreground" />
				</InputGroup.Addon>
				<InputGroup.Addon align="inline-end">
					<RadioIcon class="animate-pulse text-red-500" />
				</InputGroup.Addon>
			</InputGroup.Root>
		</Field.Field>
		<Field.Field>
			<Field.Label for="input-addon-20">Addon (block-start)</Field.Label>
			<InputGroup.Root class="h-auto">
				<InputGroup.Input id="input-addon-20" />
				<InputGroup.Addon align="block-start">
					<InputGroup.Text>First Name</InputGroup.Text>
					<InfoIcon class="ml-auto text-muted-foreground" />
				</InputGroup.Addon>
			</InputGroup.Root>
		</Field.Field>
		<Field.Field>
			<Field.Label for="input-addon-21">Addon (block-end)</Field.Label>
			<InputGroup.Root class="h-auto">
				<InputGroup.Input id="input-addon-21" />
				<InputGroup.Addon align="block-end">
					<InputGroup.Text>20/240 characters</InputGroup.Text>
					<InfoIcon class="ml-auto text-muted-foreground" />
				</InputGroup.Addon>
			</InputGroup.Root>
		</Field.Field>
		<Field.Field>
			<Field.Label for="input-icon-both-10">Multiple Icons</Field.Label>
			<InputGroup.Root>
				<InputGroup.Input id="input-icon-both-10" />
				<InputGroup.Addon align="inline-end">
					<StarIcon />
					<InputGroup.Button size="icon-xs" onclick={() => {}}>
						<CopyIcon />
					</InputGroup.Button>
				</InputGroup.Addon>
				<InputGroup.Addon>
					<RadioIcon class="animate-pulse text-red-500" />
				</InputGroup.Addon>
			</InputGroup.Root>
		</Field.Field>
		<Field.Field>
			<Field.Label for="input-description-10">Description</Field.Label>
			<InputGroup.Root>
				<InputGroup.Input id="input-description-10" />
				<InputGroup.Addon align="inline-end">
					<InfoIcon />
				</InputGroup.Addon>
			</InputGroup.Root>
			<Field.Description>This is a description of the input group.</Field.Description>
		</Field.Field>
		<Field.Field>
			<Field.Label for="input-label-10">Label</Field.Label>
			<InputGroup.Root>
				<InputGroup.Addon>
					<Field.Label for="input-label-10">Label</Field.Label>
				</InputGroup.Addon>
				<InputGroup.Input id="input-label-10" />
			</InputGroup.Root>
			<InputGroup.Root>
				<InputGroup.Input id="input-optional-12" aria-label="Optional" />
				<InputGroup.Addon align="inline-end">
					<InputGroup.Text>(optional)</InputGroup.Text>
				</InputGroup.Addon>
			</InputGroup.Root>
		</Field.Field>
	</Field.Group>
</Example>
