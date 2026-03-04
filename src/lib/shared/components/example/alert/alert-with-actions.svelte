<script lang="ts">
	import * as Alert from '$lib/shared/components/ui/alert/index.js';
	import { Badge } from '$lib/shared/components/ui/badge/index.js';
	import { Button } from '$lib/shared/components/ui/button/index.js';

	import CircleAlertIcon from '@lucide/svelte/icons/circle-alert';

	import Example from '../example.svelte';
</script>

<Example title="With Actions">
	<div class="mx-auto flex w-full max-w-lg flex-col gap-4">
		<Alert.Root>
			<CircleAlertIcon />
			<Alert.Title>The selected emails have been marked as spam.</Alert.Title>
			<Alert.Action>
				<Button size="xs">Undo</Button>
			</Alert.Action>
		</Alert.Root>
		<Alert.Root>
			<CircleAlertIcon />
			<Alert.Title>The selected emails have been marked as spam.</Alert.Title>
			<Alert.Description>
				This is a very long alert title that demonstrates how the component handles extended text
				content.
			</Alert.Description>
			<Alert.Action>
				<Badge variant="secondary">Badge</Badge>
			</Alert.Action>
		</Alert.Root>
	</div>
</Example>
