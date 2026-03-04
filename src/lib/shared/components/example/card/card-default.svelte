<script lang="ts">
	import * as Button from '$lib/shared/components/ui/button/index.js';
	import * as Card from '$lib/shared/components/ui/card/index.js';

	import Example from '../example.svelte';
</script>

<Example title="Default Size">
	<Card.Root size="default" class="mx-auto w-full max-w-sm">
		<Card.Header>
			<Card.Title>Default Card</Card.Title>
			<Card.Description>This card uses the default size variant.</Card.Description>
		</Card.Header>
		<Card.Content>
			<p>
				The card component supports a size prop that defaults to `default` for standard spacing and
				sizing.
			</p>
		</Card.Content>
		<Card.Footer>
			<Button.Root variant="outline" class="w-full">Action</Button.Root>
		</Card.Footer>
	</Card.Root>
</Example>
