<script lang="ts">
	import { tick } from 'svelte';

	import { Button } from '$lib/shared/components/ui/button/index.js';
	import { buttonVariants } from '$lib/shared/components/ui/button/index.js';
	import * as Card from '$lib/shared/components/ui/card/index.js';
	import * as Command from '$lib/shared/components/ui/command/index.js';
	import * as DropdownMenu from '$lib/shared/components/ui/dropdown-menu/index.js';
	import * as Field from '$lib/shared/components/ui/field/index.js';
	import { Input } from '$lib/shared/components/ui/input/index.js';
	import * as Popover from '$lib/shared/components/ui/popover/index.js';
	import * as Select from '$lib/shared/components/ui/select/index.js';
	import { Textarea } from '$lib/shared/components/ui/textarea/index.js';
	import { cn } from '$lib/shared/utils';

	import { setMode } from 'mode-watcher';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import DownloadIcon from '@lucide/svelte/icons/download';
	import EyeIcon from '@lucide/svelte/icons/eye';
	import FileIcon from '@lucide/svelte/icons/file';
	import FileCodeIcon from '@lucide/svelte/icons/file-code';
	import FileTextIcon from '@lucide/svelte/icons/file-text';
	import FolderIcon from '@lucide/svelte/icons/folder';
	import FolderOpenIcon from '@lucide/svelte/icons/folder-open';
	import FolderSearchIcon from '@lucide/svelte/icons/folder-search';
	import HelpCircleIcon from '@lucide/svelte/icons/help-circle';
	import LayoutIcon from '@lucide/svelte/icons/layout';
	import LogOutIcon from '@lucide/svelte/icons/log-out';
	import MonitorIcon from '@lucide/svelte/icons/monitor';
	import MoonIcon from '@lucide/svelte/icons/moon';
	import MoreHorizontalIcon from '@lucide/svelte/icons/more-horizontal';
	import MoreVerticalIcon from '@lucide/svelte/icons/more-vertical';
	import PaletteIcon from '@lucide/svelte/icons/palette';
	import SaveIcon from '@lucide/svelte/icons/save';
	import SunIcon from '@lucide/svelte/icons/sun';

	import Example from '../example.svelte';

	const frameworks = ['Next.js', 'SvelteKit', 'Nuxt.js', 'Remix', 'Astro'] as const;

	const roleItems = [
		{ label: 'Developer', value: 'developer' },
		{ label: 'Designer', value: 'designer' },
		{ label: 'Manager', value: 'manager' },
		{ label: 'Other', value: 'other' }
	];

	let notifications = $state({
		email: true,
		sms: false,
		push: true
	});
	let theme = $state('light');
	let frameworkOpen = $state(false);
	let frameworkValue = $state('');
	let role = $state<string | undefined>(undefined);
	let triggerRef = $state<HTMLButtonElement>(null!);

	const selectedFramework = $derived(
		frameworks.find((f) => f.toLowerCase() === frameworkValue) || ''
	);

	function closeAndFocusTrigger() {
		frameworkOpen = false;
		tick().then(() => {
			triggerRef.focus();
		});
	}

	const roleLabel = $derived(roleItems.find((item) => item.value === role)?.label ?? 'Select role');
</script>

<Example title="Form">
	<Card.Root class="w-full max-w-md">
		<Card.Header>
			<Card.Title>User Information</Card.Title>
			<Card.Description>Please fill in your details below</Card.Description>
			<Card.Action>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						{#snippet child({ props })}
							<Button variant="ghost" size="icon" {...props}>
								<MoreVerticalIcon />
								<span class="sr-only">More options</span>
							</Button>
						{/snippet}
					</DropdownMenu.Trigger>
					<DropdownMenu.Content
						align="end"
						class="style-maia:w-56 style-mira:w-48 style-vega:w-56 style-lyra:w-48 style-nova:w-48"
					>
						<DropdownMenu.Group>
							<DropdownMenu.Label>File</DropdownMenu.Label>
							<DropdownMenu.Item>
								<FileIcon />
								New File
								<DropdownMenu.Shortcut>⌘N</DropdownMenu.Shortcut>
							</DropdownMenu.Item>
							<DropdownMenu.Item>
								<FolderIcon />
								New Folder
								<DropdownMenu.Shortcut>⇧⌘N</DropdownMenu.Shortcut>
							</DropdownMenu.Item>
							<DropdownMenu.Sub>
								<DropdownMenu.SubTrigger>
									<FolderOpenIcon />
									Open Recent
								</DropdownMenu.SubTrigger>
								<DropdownMenu.SubContent>
									<DropdownMenu.Group>
										<DropdownMenu.Label>Recent Projects</DropdownMenu.Label>
										<DropdownMenu.Item>
											<FileCodeIcon />
											Project Alpha
										</DropdownMenu.Item>
										<DropdownMenu.Item>
											<FileCodeIcon />
											Project Beta
										</DropdownMenu.Item>
										<DropdownMenu.Sub>
											<DropdownMenu.SubTrigger>
												<MoreHorizontalIcon />
												More Projects
											</DropdownMenu.SubTrigger>
											<DropdownMenu.SubContent>
												<DropdownMenu.Item>
													<FileCodeIcon />
													Project Gamma
												</DropdownMenu.Item>
												<DropdownMenu.Item>
													<FileCodeIcon />
													Project Delta
												</DropdownMenu.Item>
											</DropdownMenu.SubContent>
										</DropdownMenu.Sub>
									</DropdownMenu.Group>
									<DropdownMenu.Separator />
									<DropdownMenu.Group>
										<DropdownMenu.Item>
											<FolderSearchIcon />
											Browse...
										</DropdownMenu.Item>
									</DropdownMenu.Group>
								</DropdownMenu.SubContent>
							</DropdownMenu.Sub>
							<DropdownMenu.Separator />
							<DropdownMenu.Item>
								<SaveIcon />
								Save
								<DropdownMenu.Shortcut>⌘S</DropdownMenu.Shortcut>
							</DropdownMenu.Item>
							<DropdownMenu.Item>
								<DownloadIcon />
								Export
								<DropdownMenu.Shortcut>⇧⌘E</DropdownMenu.Shortcut>
							</DropdownMenu.Item>
						</DropdownMenu.Group>
						<DropdownMenu.Separator />
						<DropdownMenu.Group>
							<DropdownMenu.Label>View</DropdownMenu.Label>
							<DropdownMenu.CheckboxItem
								checked={notifications.email}
								onCheckedChange={(checked) => {
									notifications = { ...notifications, email: checked === true };
								}}
							>
								<EyeIcon />
								Show Sidebar
							</DropdownMenu.CheckboxItem>
							<DropdownMenu.CheckboxItem
								checked={notifications.sms}
								onCheckedChange={(checked) => {
									notifications = { ...notifications, sms: checked === true };
								}}
							>
								<LayoutIcon />
								Show Status Bar
							</DropdownMenu.CheckboxItem>
							<DropdownMenu.Sub>
								<DropdownMenu.SubTrigger>
									<PaletteIcon />
									Theme
								</DropdownMenu.SubTrigger>
								<DropdownMenu.SubContent>
									<DropdownMenu.Group>
										<DropdownMenu.Label>Appearance</DropdownMenu.Label>
										<DropdownMenu.RadioGroup
											value={theme}
											onValueChange={(value) => {
												setMode(value as 'light' | 'dark' | 'system');
											}}
										>
											<DropdownMenu.RadioItem value="light">
												<SunIcon />
												Light
											</DropdownMenu.RadioItem>
											<DropdownMenu.RadioItem value="dark">
												<MoonIcon />
												Dark
											</DropdownMenu.RadioItem>
											<DropdownMenu.RadioItem value="system">
												<MonitorIcon />
												System
											</DropdownMenu.RadioItem>
										</DropdownMenu.RadioGroup>
									</DropdownMenu.Group>
								</DropdownMenu.SubContent>
							</DropdownMenu.Sub>
						</DropdownMenu.Group>
						<DropdownMenu.Separator />
						<DropdownMenu.Group>
							<DropdownMenu.Item>
								<HelpCircleIcon />
								Help & Support
							</DropdownMenu.Item>
							<DropdownMenu.Item>
								<FileTextIcon />
								Documentation
							</DropdownMenu.Item>
						</DropdownMenu.Group>
						<DropdownMenu.Separator />
						<DropdownMenu.Group>
							<DropdownMenu.Item variant="destructive">
								<LogOutIcon />
								Sign Out
								<DropdownMenu.Shortcut>⇧⌘Q</DropdownMenu.Shortcut>
							</DropdownMenu.Item>
						</DropdownMenu.Group>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</Card.Action>
		</Card.Header>
		<Card.Content>
			<form>
				<Field.Group>
					<div class="grid grid-cols-2 gap-4">
						<Field.Field>
							<Field.Label for="small-form-name">Name</Field.Label>
							<Input id="small-form-name" placeholder="Enter your name" required />
						</Field.Field>
						<Field.Field>
							<Field.Label for="small-form-role">Role</Field.Label>
							<Select.Root type="single" bind:value={role}>
								<Select.Trigger id="small-form-role">
									{roleLabel}
								</Select.Trigger>
								<Select.Content>
									<Select.Group>
										{#each roleItems as item (item.value)}
											<Select.Item value={item.value}>{item.label}</Select.Item>
										{/each}
									</Select.Group>
								</Select.Content>
							</Select.Root>
						</Field.Field>
					</div>
					<Field.Field>
						<Field.Label for="small-form-framework">Framework</Field.Label>
						<Popover.Root bind:open={frameworkOpen}>
							<Popover.Trigger
								bind:ref={triggerRef}
								role="combobox"
								class={cn(
									buttonVariants({ variant: 'outline' }),
									'w-full justify-between',
									!frameworkValue && 'text-muted-foreground'
								)}
							>
								{selectedFramework || 'Select a framework'}
								<ChevronDownIcon />
							</Popover.Trigger>
							<Popover.Content class="w-(--bits-popover-anchor-width) p-0">
								<Command.Root>
									<Command.Input autofocus placeholder="Search framework..." />
									<Command.Empty>No frameworks found.</Command.Empty>
									<Command.List>
										<Command.Group>
											{#each frameworks as framework (framework)}
												<Command.Item
													value={framework}
													data-checked={frameworkValue === framework.toLowerCase()}
													onSelect={() => {
														frameworkValue = framework.toLowerCase();
														closeAndFocusTrigger();
													}}
												>
													{framework}
												</Command.Item>
											{/each}
										</Command.Group>
									</Command.List>
								</Command.Root>
							</Popover.Content>
						</Popover.Root>
					</Field.Field>
					<Field.Field>
						<Field.Label for="small-form-comments">Comments</Field.Label>
						<Textarea id="small-form-comments" placeholder="Add any additional comments" />
					</Field.Field>
					<Field.Field orientation="horizontal">
						<Button type="submit">Submit</Button>
						<Button variant="outline" type="button">Cancel</Button>
					</Field.Field>
				</Field.Group>
			</form>
		</Card.Content>
	</Card.Root>
</Example>
