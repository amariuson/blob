<script lang="ts">
	import * as Pagination from '$lib/shared/components/ui/pagination/index.js';

	import Example from '../example.svelte';
</script>

<Example title="Simple">
	<Pagination.Root count={50} perPage={10}>
		{#snippet children({ pages, currentPage })}
			<Pagination.Content>
				{#each pages as page (page.key)}
					<Pagination.Item>
						{#if page.type === 'ellipsis'}
							<Pagination.Ellipsis />
						{:else}
							<Pagination.Link {page} isActive={currentPage === page.value} />
						{/if}
					</Pagination.Item>
				{/each}
			</Pagination.Content>
		{/snippet}
	</Pagination.Root>
</Example>
