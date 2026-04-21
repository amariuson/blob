<script lang="ts">
	import type { Snippet } from 'svelte';

	import * as Card from '$lib/shared/components/ui/card';

	type Props = {
		heading: string;
		subHeading: string;
		children: Snippet;
		below?: Snippet;
	};

	const { heading, subHeading, children, below }: Props = $props();
</script>

<section class="flex min-h-screen px-4 py-16 md:py-32">
	<div class="m-auto h-fit w-full max-w-92">
		<Card.Root>
			<Card.Header>
				<Card.Title>{heading}</Card.Title>
				<Card.Description>{subHeading}</Card.Description>
			</Card.Header>
			<Card.Content>
				{@render children()}
			</Card.Content>
		</Card.Root>
		{@render below?.()}
	</div>
</section>
