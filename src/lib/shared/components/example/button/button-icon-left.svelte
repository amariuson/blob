<script lang="ts">
	import { Button } from '$lib/shared/components/ui/button/index.js';

	import ArrowLeftCircleIcon from '@lucide/svelte/icons/arrow-left-circle';

	import Example from '../example.svelte';
</script>

<Example title="Icon Left">
	<div class="flex flex-wrap items-center gap-2">
		<Button size="xs">
			<ArrowLeftCircleIcon data-icon="inline-start" />
			Default
		</Button>
		<Button size="xs" variant="secondary">
			<ArrowLeftCircleIcon data-icon="inline-start" />
			Secondary
		</Button>
		<Button size="xs" variant="outline">
			<ArrowLeftCircleIcon data-icon="inline-start" />
			Outline
		</Button>
		<Button size="xs" variant="ghost">
			<ArrowLeftCircleIcon data-icon="inline-start" />
			Ghost
		</Button>
		<Button size="xs" variant="destructive">
			<ArrowLeftCircleIcon data-icon="inline-start" />
			Destructive
		</Button>
		<Button size="xs" variant="link">
			<ArrowLeftCircleIcon data-icon="inline-start" />
			Link
		</Button>
	</div>
	<div class="flex flex-wrap items-center gap-2">
		<Button size="sm">
			<ArrowLeftCircleIcon data-icon="inline-start" />
			Default
		</Button>
		<Button size="sm" variant="secondary">
			<ArrowLeftCircleIcon data-icon="inline-start" />
			Secondary
		</Button>
		<Button size="sm" variant="outline">
			<ArrowLeftCircleIcon data-icon="inline-start" />
			Outline
		</Button>
		<Button size="sm" variant="ghost">
			<ArrowLeftCircleIcon data-icon="inline-start" />
			Ghost
		</Button>
		<Button size="sm" variant="destructive">
			<ArrowLeftCircleIcon data-icon="inline-start" />
			Destructive
		</Button>
		<Button size="sm" variant="link">
			<ArrowLeftCircleIcon data-icon="inline-start" />
			Link
		</Button>
	</div>
	<div class="flex flex-wrap items-center gap-2">
		<Button>
			<ArrowLeftCircleIcon data-icon="inline-start" />
			Default
		</Button>
		<Button variant="secondary">
			<ArrowLeftCircleIcon data-icon="inline-start" />
			Secondary
		</Button>
		<Button variant="outline">
			<ArrowLeftCircleIcon data-icon="inline-start" />
			Outline
		</Button>
		<Button variant="ghost">
			<ArrowLeftCircleIcon data-icon="inline-start" />
			Ghost
		</Button>
		<Button variant="destructive">
			<ArrowLeftCircleIcon data-icon="inline-start" />
			Destructive
		</Button>
		<Button variant="link">
			<ArrowLeftCircleIcon data-icon="inline-start" />
			Link
		</Button>
	</div>
	<div class="flex flex-wrap items-center gap-2">
		<Button size="lg">
			<ArrowLeftCircleIcon data-icon="inline-start" />
			Default
		</Button>
		<Button size="lg" variant="secondary">
			<ArrowLeftCircleIcon data-icon="inline-start" />
			Secondary
		</Button>
		<Button size="lg" variant="outline">
			<ArrowLeftCircleIcon data-icon="inline-start" />
			Outline
		</Button>
		<Button size="lg" variant="ghost">
			<ArrowLeftCircleIcon data-icon="inline-start" />
			Ghost
		</Button>
		<Button size="lg" variant="destructive">
			<ArrowLeftCircleIcon data-icon="inline-start" />
			Destructive
		</Button>
		<Button size="lg" variant="link">
			<ArrowLeftCircleIcon data-icon="inline-start" />
			Link
		</Button>
	</div>
</Example>
