<script lang="ts">
	import * as Collapsible from '$lib/shared/components/ui/collapsible/index.js';
	import * as Sidebar from '$lib/shared/components/ui/sidebar/index.js';

	import ChartLineIcon from '@lucide/svelte/icons/chart-line';
	import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
	import FileIcon from '@lucide/svelte/icons/file';
	import HomeIcon from '@lucide/svelte/icons/home';
	import LifeBuoyIcon from '@lucide/svelte/icons/life-buoy';
	import SendIcon from '@lucide/svelte/icons/send';
	import Settings2Icon from '@lucide/svelte/icons/settings-2';
	import ShoppingBagIcon from '@lucide/svelte/icons/shopping-bag';
	import ShoppingCartIcon from '@lucide/svelte/icons/shopping-cart';
	import UserIcon from '@lucide/svelte/icons/user';

	const iconMap: Record<string, typeof HomeIcon> = {
		HomeIcon,
		ChartLineIcon,
		ShoppingBagIcon,
		ShoppingCartIcon,
		FileIcon,
		UserIcon,
		Settings2Icon,
		LifeBuoyIcon,
		SendIcon
	};

	const data = {
		navMain: [
			{
				title: 'Dashboard',
				url: '#',
				icon: 'HomeIcon',
				isActive: true,
				items: [
					{
						title: 'Overview',
						url: '#'
					},
					{
						title: 'Analytics',
						url: '#'
					}
				]
			},
			{
				title: 'Analytics',
				url: '#',
				icon: 'ChartLineIcon',
				items: [
					{
						title: 'Reports',
						url: '#'
					},
					{
						title: 'Metrics',
						url: '#'
					}
				]
			},
			{
				title: 'Orders',
				url: '#',
				icon: 'ShoppingBagIcon',
				items: [
					{
						title: 'All Orders',
						url: '#'
					},
					{
						title: 'Pending',
						url: '#'
					},
					{
						title: 'Completed',
						url: '#'
					}
				]
			},
			{
				title: 'Products',
				url: '#',
				icon: 'ShoppingCartIcon',
				items: [
					{
						title: 'All Products',
						url: '#'
					},
					{
						title: 'Categories',
						url: '#'
					}
				]
			},
			{
				title: 'Invoices',
				url: '#',
				icon: 'FileIcon'
			},
			{
				title: 'Customers',
				url: '#',
				icon: 'UserIcon'
			},
			{
				title: 'Settings',
				url: '#',
				icon: 'Settings2Icon'
			}
		],
		navSecondary: [
			{
				title: 'Support',
				url: '#',
				icon: 'LifeBuoyIcon'
			},
			{
				title: 'Feedback',
				url: '#',
				icon: 'SendIcon'
			}
		]
	};
</script>

<Sidebar.Provider>
	<Sidebar.Root variant="inset" class="absolute">
		<Sidebar.Content>
			<Sidebar.Group>
				<Sidebar.GroupLabel>Dashboard</Sidebar.GroupLabel>
				<Sidebar.Menu>
					{#each data.navMain as item (item.title)}
						<Collapsible.Root open={item.isActive}>
							{#snippet child({ props })}
								<Sidebar.MenuItem {...props}>
									<Sidebar.MenuButton isActive={item.isActive}>
										{#snippet child({ props })}
											{@const NavIcon = iconMap[item.icon]}
											<a href={item.url} {...props}>
												<NavIcon />
												<span>{item.title}</span>
											</a>
										{/snippet}
									</Sidebar.MenuButton>
									{#if item.items?.length}
										<Collapsible.Trigger>
											{#snippet child({ props })}
												<Sidebar.MenuAction class="data-[state=open]:rotate-90" {...props}>
													<ChevronRightIcon />
													<span class="sr-only">Toggle</span>
												</Sidebar.MenuAction>
											{/snippet}
										</Collapsible.Trigger>
										<Collapsible.Content>
											<Sidebar.MenuSub>
												{#each item.items as subItem (subItem.title)}
													<Sidebar.MenuSubItem>
														<Sidebar.MenuSubButton>
															{#snippet child({ props })}
																<a href={subItem.url} {...props}>{subItem.title}</a>
															{/snippet}
														</Sidebar.MenuSubButton>
													</Sidebar.MenuSubItem>
												{/each}
											</Sidebar.MenuSub>
										</Collapsible.Content>
									{/if}
								</Sidebar.MenuItem>
							{/snippet}
						</Collapsible.Root>
					{/each}
				</Sidebar.Menu>
			</Sidebar.Group>
			<Sidebar.Group class="mt-auto">
				<Sidebar.GroupContent>
					<Sidebar.Menu>
						{#each data.navSecondary as item (item.title)}
							<Sidebar.MenuItem>
								<Sidebar.MenuButton size="sm">
									{#snippet child({ props })}
										{@const NavIcon = iconMap[item.icon]}
										<a href={item.url} {...props}>
											<NavIcon />
											<span>{item.title}</span>
										</a>
									{/snippet}
								</Sidebar.MenuButton>
							</Sidebar.MenuItem>
						{/each}
					</Sidebar.Menu>
				</Sidebar.GroupContent>
			</Sidebar.Group>
		</Sidebar.Content>
		<Sidebar.Rail />
	</Sidebar.Root>
	<Sidebar.Inset>
		<header class="flex h-16 shrink-0 items-center gap-2 border-b px-4">
			<Sidebar.Trigger class="-ml-1" />
		</header>
		<div class="flex flex-1 flex-col gap-4 p-4">
			<div class="grid auto-rows-min gap-4 md:grid-cols-3">
				<div class="aspect-video rounded-xl bg-muted/50"></div>
				<div class="aspect-video rounded-xl bg-muted/50"></div>
				<div class="aspect-video rounded-xl bg-muted/50"></div>
			</div>
			<div class="min-h-screen flex-1 rounded-xl bg-muted/50 md:min-h-min"></div>
		</div>
	</Sidebar.Inset>
</Sidebar.Provider>
