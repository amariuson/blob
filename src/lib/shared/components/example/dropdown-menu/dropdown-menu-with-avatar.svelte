<script lang="ts">
	import * as Avatar from '$lib/shared/components/ui/avatar/index.js';
	import { Button } from '$lib/shared/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/shared/components/ui/dropdown-menu/index.js';

	import BadgeCheckIcon from '@lucide/svelte/icons/badge-check';
	import BellIcon from '@lucide/svelte/icons/bell';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import CreditCardIcon from '@lucide/svelte/icons/credit-card';
	import LogOutIcon from '@lucide/svelte/icons/log-out';

	import Example from '../example.svelte';
</script>

<Example title="With Avatar">
	<div class="flex items-center justify-between gap-4">
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Button variant="outline" class="h-12 justify-start px-2 md:max-w-[200px]" {...props}>
						<Avatar.Root>
							<Avatar.Image src="https://github.com/shadcn.png" alt="Shadcn" />
							<Avatar.Fallback class="rounded-lg">CN</Avatar.Fallback>
						</Avatar.Root>
						<div class="grid flex-1 text-left text-sm leading-tight">
							<span class="truncate font-semibold">shadcn</span>
							<span class="truncate text-xs text-muted-foreground"> shadcn@example.com </span>
						</div>
						<ChevronsUpDownIcon class="ml-auto text-muted-foreground" />
					</Button>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content class="w-(--anchor-width) min-w-56">
				<DropdownMenu.Group>
					<DropdownMenu.Item>
						<BadgeCheckIcon />
						Account
					</DropdownMenu.Item>
					<DropdownMenu.Item>
						<CreditCardIcon />
						Billing
					</DropdownMenu.Item>
					<DropdownMenu.Item>
						<BellIcon />
						Notifications
					</DropdownMenu.Item>
				</DropdownMenu.Group>
				<DropdownMenu.Separator />
				<DropdownMenu.Item>
					<LogOutIcon />
					Sign Out
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Button variant="ghost" size="icon" class="rounded-full" {...props}>
						<Avatar.Root>
							<Avatar.Image src="https://github.com/shadcn.png" alt="shadcn" />
							<Avatar.Fallback>LR</Avatar.Fallback>
						</Avatar.Root>
					</Button>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="end" side="top">
				<DropdownMenu.Group>
					<DropdownMenu.Item>
						<BadgeCheckIcon />
						Account
					</DropdownMenu.Item>
					<DropdownMenu.Item>
						<CreditCardIcon />
						Billing
					</DropdownMenu.Item>
					<DropdownMenu.Item>
						<BellIcon />
						Notifications
					</DropdownMenu.Item>
				</DropdownMenu.Group>
				<DropdownMenu.Separator />
				<DropdownMenu.Item>
					<LogOutIcon />
					Sign Out
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
</Example>
