<script lang="ts">
	import * as Button from '$lib/shared/components/ui/button/index.js';
	import * as Card from '$lib/shared/components/ui/card/index.js';

	import Example from '../example.svelte';
</script>

<Example title="Footer with Border (Small)">
	<Card.Root size="sm" class="mx-auto w-full max-w-sm">
		<Card.Content>
			<p>
				The footer has a border-t class applied, creating a visual separation between the content
				and footer sections.
			</p>
		</Card.Content>
		<Card.Footer class="border-t">
			<Button.Root variant="outline" size="sm" class="w-full">Footer with Border</Button.Root>
		</Card.Footer>
	</Card.Root>
</Example>
