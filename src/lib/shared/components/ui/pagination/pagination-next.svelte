<script lang="ts">
	import type { ComponentProps } from 'svelte';

	import { cn } from '$lib/shared/utils.js';

	import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';

	import { PaginationLink } from './index.js';

	type PaginationNextProps = ComponentProps<typeof PaginationLink>;

	let { class: className, ...restProps }: PaginationNextProps = $props();
</script>

<PaginationLink
	aria-label="Go to next page"
	size="default"
	class={cn('pr-1.5!', className)}
	{...restProps}
>
	<span class=" hidden sm:block">Next</span>
	<ChevronRightIcon data-icon="inline-end" />
</PaginationLink>
