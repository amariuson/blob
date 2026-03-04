<script lang="ts">
	import { Button } from '$lib/shared/components/ui/button/index.js';

	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';

	import Example from '../example.svelte';
</script>

<Example title="Icon Right">
	<div class="flex flex-wrap items-center gap-2">
		<Button size="xs">
			Default
			<ArrowRightIcon data-icon="inline-end" />
		</Button>
		<Button size="xs" variant="secondary">
			Secondary
			<ArrowRightIcon data-icon="inline-end" />
		</Button>
		<Button size="xs" variant="outline">
			Outline
			<ArrowRightIcon data-icon="inline-end" />
		</Button>
		<Button size="xs" variant="ghost">
			Ghost
			<ArrowRightIcon data-icon="inline-end" />
		</Button>
		<Button size="xs" variant="destructive">
			Destructive
			<ArrowRightIcon data-icon="inline-end" />
		</Button>
		<Button size="xs" variant="link">
			Link
			<ArrowRightIcon data-icon="inline-end" />
		</Button>
	</div>
	<div class="flex flex-wrap items-center gap-2">
		<Button size="sm">
			Default
			<ArrowRightIcon data-icon="inline-end" />
		</Button>
		<Button size="sm" variant="secondary">
			Secondary
			<ArrowRightIcon data-icon="inline-end" />
		</Button>
		<Button size="sm" variant="outline">
			Outline
			<ArrowRightIcon />
		</Button>
		<Button size="sm" variant="ghost">
			Ghost
			<ArrowRightIcon data-icon="inline-end" />
		</Button>
		<Button size="sm" variant="destructive">
			Destructive
			<ArrowRightIcon data-icon="inline-end" />
		</Button>
		<Button size="sm" variant="link">
			Link
			<ArrowRightIcon data-icon="inline-end" />
		</Button>
	</div>
	<div class="flex flex-wrap items-center gap-2">
		<Button>
			Default
			<ArrowRightIcon data-icon="inline-end" />
		</Button>
		<Button variant="secondary">
			Secondary
			<ArrowRightIcon data-icon="inline-end" />
		</Button>
		<Button variant="outline">
			Outline
			<ArrowRightIcon data-icon="inline-end" />
		</Button>
		<Button variant="ghost">
			Ghost
			<ArrowRightIcon data-icon="inline-end" />
		</Button>
		<Button variant="destructive">
			Destructive
			<ArrowRightIcon data-icon="inline-end" />
		</Button>
		<Button variant="link">
			Link
			<ArrowRightIcon data-icon="inline-end" />
		</Button>
	</div>
	<div class="flex flex-wrap items-center gap-2">
		<Button size="lg">
			Default
			<ArrowRightIcon data-icon="inline-end" />
		</Button>
		<Button size="lg" variant="secondary">
			Secondary
			<ArrowRightIcon data-icon="inline-end" />
		</Button>
		<Button size="lg" variant="outline">
			Outline
			<ArrowRightIcon data-icon="inline-end" />
		</Button>
		<Button size="lg" variant="ghost">
			Ghost
			<ArrowRightIcon data-icon="inline-end" />
		</Button>
		<Button size="lg" variant="destructive">
			Destructive
			<ArrowRightIcon data-icon="inline-end" />
		</Button>
		<Button size="lg" variant="link">
			Link
			<ArrowRightIcon data-icon="inline-end" />
		</Button>
	</div>
</Example>
