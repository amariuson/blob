<script lang="ts">
	import type { Component } from 'svelte';

	import * as Sidebar from '$lib/shared/components/ui/sidebar/index.js';
	let {
		items,
		label
	}: {
		items: {
			title: string;
			url: string;
			icon: Component;
			isActive?: boolean;
		}[];
		label?: string;
	} = $props();
</script>

<Sidebar.Group>
	{#if label}
		<Sidebar.GroupLabel>{label}</Sidebar.GroupLabel>
	{/if}
	<Sidebar.GroupContent>
		<Sidebar.Menu>
			{#each items as item (item.title)}
				<Sidebar.MenuItem>
					<Sidebar.MenuButton isActive={item.isActive}>
						{#snippet child({ props })}
							<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
							<a href={item.url} {...props}>
								<item.icon />
								<span>{item.title}</span>
							</a>
						{/snippet}
					</Sidebar.MenuButton>
				</Sidebar.MenuItem>
			{/each}
		</Sidebar.Menu>
	</Sidebar.GroupContent>
</Sidebar.Group>
