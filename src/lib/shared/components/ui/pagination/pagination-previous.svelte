<script lang="ts">
	import type { ComponentProps } from 'svelte';

	import { cn } from '$lib/shared/utils.js';

	import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left';

	import { PaginationLink } from './index.js';

	type PaginationPreviousProps = ComponentProps<typeof PaginationLink>;

	let { class: className, ...restProps }: PaginationPreviousProps = $props();
</script>

<PaginationLink
	aria-label="Go to previous page"
	size="default"
	class={cn('pl-1.5!', className)}
	{...restProps}
>
	<ChevronLeftIcon data-icon="inline-start" />
	<span class=" hidden sm:block">Previous</span>
</PaginationLink>
