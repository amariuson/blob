<script lang="ts">
	import { Button } from '$lib/shared/components/ui/button/index.js';
	import * as Command from '$lib/shared/components/ui/command/index.js';
	import * as DropdownMenu from '$lib/shared/components/ui/dropdown-menu/index.js';
	import * as Empty from '$lib/shared/components/ui/empty/index.js';
	import * as Field from '$lib/shared/components/ui/field/index.js';
	import * as InputGroup from '$lib/shared/components/ui/input-group/index.js';
	import { Kbd } from '$lib/shared/components/ui/kbd/index.js';
	import * as Popover from '$lib/shared/components/ui/popover/index.js';
	import * as Tooltip from '$lib/shared/components/ui/tooltip/index.js';

	import BotIcon from '@lucide/svelte/icons/bot';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import CloudCogIcon from '@lucide/svelte/icons/cloud-cog';
	import GitBranchIcon from '@lucide/svelte/icons/git-branch';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import SearchIcon from '@lucide/svelte/icons/search';
	import SendIcon from '@lucide/svelte/icons/send';
	import UploadIcon from '@lucide/svelte/icons/upload';

	import Example from '../example.svelte';
	let selectedBranch = $state('main');

	const branches = [
		'main',
		'develop',
		'feature/123',
		'feature/user-authentication',
		'feature/dashboard-redesign',
		'bugfix/login-error',
		'hotfix/security-patch',
		'release/v2.0.0',
		'feature/api-integration',
		'bugfix/memory-leak',
		'feature/dark-mode',
		'feature/responsive-design',
		'bugfix/typo-fix',
		'feature/search-functionality',
		'release/v1.9.0',
		'feature/notifications',
		'bugfix/cache-issue',
		'feature/payment-gateway',
		'hotfix/critical-bug',
		'feature/admin-panel',
		'bugfix/validation-error',
		'feature/analytics',
		'release/v2.1.0'
	];
</script>

<Example title="Repository Toolbar">
	<div class="flex items-center gap-2">
		<InputGroup.Root>
			<InputGroup.Input placeholder="Go to file" />
			<InputGroup.Addon align="inline-start">
				<InputGroup.Button variant="ghost" size="icon-xs">
					<SearchIcon />
				</InputGroup.Button>
			</InputGroup.Addon>
			<InputGroup.Addon align="inline-end">
				<Kbd>t</Kbd>
			</InputGroup.Addon>
		</InputGroup.Root>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Button variant="outline" {...props}>
						Add File
						<ChevronDownIcon data-icon="inline-end" />
					</Button>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="end">
				<DropdownMenu.Item>
					<PlusIcon />
					Create new file
				</DropdownMenu.Item>
				<DropdownMenu.Item>
					<UploadIcon />
					Upload files
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
		<Popover.Root>
			<Tooltip.Root>
				<Tooltip.Trigger>
					{#snippet child({ props })}
						<Popover.Trigger {...props}>
							{#snippet child({ props: triggerProps })}
								<Button variant="outline" size="icon" {...triggerProps}>
									<CloudCogIcon />
								</Button>
							{/snippet}
						</Popover.Trigger>
					{/snippet}
				</Tooltip.Trigger>
				<Tooltip.Content>New Agent Task</Tooltip.Content>
			</Tooltip.Root>
			<Popover.Content class="w-80">
				<Field.Field>
					<Field.Label for="new-agent-task">New Agent Task</Field.Label>
					<InputGroup.Root>
						<InputGroup.Textarea placeholder="Describe your task in natural language."
						></InputGroup.Textarea>
						<InputGroup.Addon align="block-end">
							<Popover.Root>
								<Tooltip.Root>
									<Popover.Trigger>
										{#snippet child({ props })}
											<Tooltip.Trigger {...props}>
												{#snippet child({ props: triggerProps })}
													<InputGroup.Button variant="outline" size="icon-sm" {...triggerProps}>
														<GitBranchIcon />
													</InputGroup.Button>
												{/snippet}
											</Tooltip.Trigger>
										{/snippet}
									</Popover.Trigger>
									<Tooltip.Content>Select a branch</Tooltip.Content>
								</Tooltip.Root>
								<Popover.Content side="bottom" align="start" class="p-1">
									<Field.Field>
										<Field.Label for="select-branch" class="sr-only">Select a Branch</Field.Label>
										<Command.Root>
											<Command.Input id="select-branch" placeholder="Find a branch" />
											<Command.Empty>No branches found</Command.Empty>
											<Command.List>
												<Command.Group>
													{#each branches as branch (branch)}
														<Command.Item
															value={branch}
															onSelect={() => (selectedBranch = branch)}
															data-checked={selectedBranch === branch}
														>
															{branch}
														</Command.Item>
													{/each}
												</Command.Group>
											</Command.List>
										</Command.Root>
									</Field.Field>
								</Popover.Content>
							</Popover.Root>
							<Popover.Root>
								<Tooltip.Root>
									<Popover.Trigger>
										{#snippet child({ props })}
											<Tooltip.Trigger {...props}>
												{#snippet child({ props: triggerProps })}
													<InputGroup.Button variant="outline" size="icon-sm" {...triggerProps}>
														<BotIcon />
													</InputGroup.Button>
												{/snippet}
											</Tooltip.Trigger>
										{/snippet}
									</Popover.Trigger>
									<Tooltip.Content>Select Agent</Tooltip.Content>
								</Tooltip.Root>
								<Popover.Content side="top" align="start">
									<Empty.Root class="gap-4 p-0">
										<Empty.Header>
											<Empty.Title class="text-sm">
												This repository has no custom agents
											</Empty.Title>
											<Empty.Description class="text-xs">
												Custom agents are reusable instructions and tools in your repository.
											</Empty.Description>
										</Empty.Header>
										<Empty.Content>
											<Button variant="outline" size="sm">Create Custom Agent</Button>
										</Empty.Content>
									</Empty.Root>
								</Popover.Content>
							</Popover.Root>
							<Tooltip.Root>
								<Tooltip.Trigger>
									{#snippet child({ props })}
										<InputGroup.Button variant="ghost" size="icon-sm" class="ml-auto" {...props}>
											<SendIcon />
										</InputGroup.Button>
									{/snippet}
								</Tooltip.Trigger>
								<Tooltip.Content class="flex items-center gap-2 pr-2">
									Start Task <Kbd>⏎</Kbd>
								</Tooltip.Content>
							</Tooltip.Root>
						</InputGroup.Addon>
					</InputGroup.Root>
				</Field.Field>
			</Popover.Content>
		</Popover.Root>
	</div>
</Example>
