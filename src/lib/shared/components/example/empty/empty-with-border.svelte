<script lang="ts">
	import * as Empty from '$lib/shared/components/ui/empty/index.js';
	import * as InputGroup from '$lib/shared/components/ui/input-group/index.js';
	import * as Kbd from '$lib/shared/components/ui/kbd/index.js';

	import CircleDashedIcon from '@lucide/svelte/icons/circle-dashed';

	import Example from '../example.svelte';
</script>

<Example title="With Border">
	<Empty.Root class="border">
		<Empty.Header>
			<Empty.Title>404 - Not Found</Empty.Title>
			<Empty.Description>
				The page you&apos;re looking for doesn&apos;t exist. Try searching for what you need below.
			</Empty.Description>
		</Empty.Header>
		<Empty.Content>
			<InputGroup.Root class="w-3/4">
				<InputGroup.Input placeholder="Try searching for pages..." />
				<InputGroup.Addon>
					<CircleDashedIcon />
				</InputGroup.Addon>
				<InputGroup.Addon align="inline-end">
					<Kbd.Root>/</Kbd.Root>
				</InputGroup.Addon>
			</InputGroup.Root>
			<Empty.Description>
				Need help? <a href="#/">Contact support</a>
			</Empty.Description>
		</Empty.Content>
	</Empty.Root>
</Example>
