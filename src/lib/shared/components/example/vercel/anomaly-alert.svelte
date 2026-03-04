<script lang="ts">
	import { Button } from '$lib/shared/components/ui/button/index.js';
	import * as Card from '$lib/shared/components/ui/card/index.js';
	import * as Empty from '$lib/shared/components/ui/empty/index.js';

	import Example from '../example.svelte';
</script>

<Example title="Anomaly Alert" class="items-center justify-center">
	<Card.Root class="w-full max-w-xs">
		<Card.Content class="p-6">
			<Empty.Root class="mx-auto p-0">
				<Empty.Header>
					<Empty.Title>Get alerted for anomalies</Empty.Title>
					<Empty.Description>
						Automatically monitor your projects for anomalies and get notified.
					</Empty.Description>
				</Empty.Header>
				<Empty.Content>
					<Button>Upgrade to Observability Plus</Button>
				</Empty.Content>
			</Empty.Root>
		</Card.Content>
	</Card.Root>
</Example>
