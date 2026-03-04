<script lang="ts">
	import * as Field from '$lib/shared/components/ui/field/index.js';
	import * as InputGroup from '$lib/shared/components/ui/input-group/index.js';
	import { Textarea } from '$lib/shared/components/ui/textarea/index.js';

	import ArrowUpIcon from '@lucide/svelte/icons/arrow-up';
	import CodeIcon from '@lucide/svelte/icons/code';
	import CopyIcon from '@lucide/svelte/icons/copy';
	import InfoIcon from '@lucide/svelte/icons/info';
	import RefreshCwIcon from '@lucide/svelte/icons/refresh-cw';

	import Example from '../example.svelte';
</script>

<Example title="Textarea">
	<Field.Group>
		<Field.Field>
			<Field.Label for="textarea-header-footer-12">Default Textarea (No Input Group)</Field.Label>
			<Textarea id="textarea-header-footer-12" placeholder="Enter your text here..." />
		</Field.Field>
		<Field.Field>
			<Field.Label for="textarea-header-footer-13">Input Group</Field.Label>
			<InputGroup.Root>
				<InputGroup.Textarea id="textarea-header-footer-13" placeholder="Enter your text here..." />
			</InputGroup.Root>
			<Field.Description>This is a description of the input group.</Field.Description>
		</Field.Field>
		<Field.Field data-invalid="true">
			<Field.Label for="textarea-header-footer-14">Invalid</Field.Label>
			<InputGroup.Root>
				<InputGroup.Textarea
					id="textarea-header-footer-14"
					placeholder="Enter your text here..."
					aria-invalid="true"
				/>
			</InputGroup.Root>
			<Field.Description>This is a description of the input group.</Field.Description>
		</Field.Field>
		<Field.Field data-disabled="true">
			<Field.Label for="textarea-header-footer-15">Disabled</Field.Label>
			<InputGroup.Root>
				<InputGroup.Textarea
					id="textarea-header-footer-15"
					placeholder="Enter your text here..."
					disabled
				/>
			</InputGroup.Root>
			<Field.Description>This is a description of the input group.</Field.Description>
		</Field.Field>
		<Field.Field>
			<Field.Label for="prompt-31">Addon (block-start)</Field.Label>
			<InputGroup.Root>
				<InputGroup.Textarea id="prompt-31" />
				<InputGroup.Addon align="block-start">
					<InputGroup.Text>Ask, Search or Chat...</InputGroup.Text>
					<InfoIcon class="ml-auto text-muted-foreground" />
				</InputGroup.Addon>
			</InputGroup.Root>
			<Field.Description>This is a description of the input group.</Field.Description>
		</Field.Field>
		<Field.Field>
			<Field.Label for="textarea-header-footer-30">Addon (block-end)</Field.Label>
			<InputGroup.Root>
				<InputGroup.Textarea id="textarea-header-footer-30" placeholder="Enter your text here..." />
				<InputGroup.Addon align="block-end">
					<InputGroup.Text>0/280 characters</InputGroup.Text>
					<InputGroup.Button variant="default" size="icon-xs" class="ml-auto rounded-full">
						<ArrowUpIcon />
						<span class="sr-only">Send</span>
					</InputGroup.Button>
				</InputGroup.Addon>
			</InputGroup.Root>
		</Field.Field>
		<Field.Field>
			<Field.Label for="textarea-comment-31">Addon (Buttons)</Field.Label>
			<InputGroup.Root>
				<InputGroup.Textarea
					id="textarea-comment-31"
					placeholder="Share your thoughts..."
					class="min-h-[120px]"
				/>
				<InputGroup.Addon align="block-end">
					<InputGroup.Button variant="ghost" class="ml-auto" size="sm">Cancel</InputGroup.Button>
					<InputGroup.Button variant="default" size="sm">Post Comment</InputGroup.Button>
				</InputGroup.Addon>
			</InputGroup.Root>
		</Field.Field>
		<Field.Field>
			<Field.Label for="textarea-code-32">Code Editor</Field.Label>
			<InputGroup.Root>
				<InputGroup.Textarea
					id="textarea-code-32"
					placeholder="console.log('Hello, world!');"
					class="min-h-[300px] py-3"
				/>
				<InputGroup.Addon align="block-start" class="border-b">
					<InputGroup.Text class="font-mono font-medium">
						<CodeIcon />
						script.js
					</InputGroup.Text>
					<InputGroup.Button size="icon-xs" class="ml-auto">
						<RefreshCwIcon />
					</InputGroup.Button>
					<InputGroup.Button size="icon-xs" variant="ghost">
						<CopyIcon />
					</InputGroup.Button>
				</InputGroup.Addon>
				<InputGroup.Addon align="block-end" class="border-t">
					<InputGroup.Text>Line 1, Column 1</InputGroup.Text>
					<InputGroup.Text class="ml-auto">JavaScript</InputGroup.Text>
				</InputGroup.Addon>
			</InputGroup.Root>
		</Field.Field>
	</Field.Group>
</Example>
