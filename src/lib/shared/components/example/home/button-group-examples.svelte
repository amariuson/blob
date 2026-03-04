<script lang="ts">
	import { Button } from '$lib/shared/components/ui/button/index.js';
	import * as ButtonGroup from '$lib/shared/components/ui/button-group/index.js';
	import * as DropdownMenu from '$lib/shared/components/ui/dropdown-menu/index.js';
	import * as Popover from '$lib/shared/components/ui/popover/index.js';
	import { Textarea } from '$lib/shared/components/ui/textarea/index.js';

	import AlertTriangleIcon from '@lucide/svelte/icons/alert-triangle';
	import ArchiveIcon from '@lucide/svelte/icons/archive';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import BotIcon from '@lucide/svelte/icons/bot';
	import CalendarPlusIcon from '@lucide/svelte/icons/calendar-plus';
	import CheckIcon from '@lucide/svelte/icons/check';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import ClockIcon from '@lucide/svelte/icons/clock';
	import CopyIcon from '@lucide/svelte/icons/copy';
	import ListFilterIcon from '@lucide/svelte/icons/list-filter';
	import MailCheckIcon from '@lucide/svelte/icons/mail-check';
	import ShareIcon from '@lucide/svelte/icons/share';
	import TagIcon from '@lucide/svelte/icons/tag';
	import TrashIcon from '@lucide/svelte/icons/trash';
	import Trash2Icon from '@lucide/svelte/icons/trash-2';
	import UserRoundXIcon from '@lucide/svelte/icons/user-round-x';
	import VolumeXIcon from '@lucide/svelte/icons/volume-x';

	import Example from '../example.svelte';
	let label = $state('personal');
</script>

<Example title="Button Group" class="items-center justify-center">
	<div class="flex flex-col gap-6">
		<ButtonGroup.Root>
			<ButtonGroup.Root class="hidden sm:flex">
				<Button variant="outline" size="icon-sm" aria-label="Go Back">
					<ArrowLeftIcon />
				</Button>
			</ButtonGroup.Root>
			<ButtonGroup.Root>
				<Button variant="outline" size="sm">Archive</Button>
				<Button variant="outline" size="sm">Report</Button>
			</ButtonGroup.Root>
			<ButtonGroup.Root>
				<Button variant="outline" size="sm">Snooze</Button>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						{#snippet child({ props })}
							<Button variant="outline" size="icon-sm" aria-label="More Options" {...props}>
								<ChevronDownIcon />
							</Button>
						{/snippet}
					</DropdownMenu.Trigger>
					<DropdownMenu.Content align="end" class="w-48">
						<DropdownMenu.Group>
							<DropdownMenu.Item>
								<MailCheckIcon />
								Mark as Read
							</DropdownMenu.Item>
							<DropdownMenu.Item>
								<ArchiveIcon />
								Archive
							</DropdownMenu.Item>
						</DropdownMenu.Group>
						<DropdownMenu.Separator />
						<DropdownMenu.Group>
							<DropdownMenu.Item>
								<ClockIcon />
								Snooze
							</DropdownMenu.Item>
							<DropdownMenu.Item>
								<CalendarPlusIcon />
								Add to Calendar
							</DropdownMenu.Item>
							<DropdownMenu.Item>
								<ListFilterIcon />
								Add to List
							</DropdownMenu.Item>
							<DropdownMenu.Sub>
								<DropdownMenu.SubTrigger>
									<TagIcon />
									Label As...
								</DropdownMenu.SubTrigger>
								<DropdownMenu.SubContent>
									<DropdownMenu.Group>
										<DropdownMenu.RadioGroup bind:value={label}>
											<DropdownMenu.RadioItem value="personal">Personal</DropdownMenu.RadioItem>
											<DropdownMenu.RadioItem value="work">Work</DropdownMenu.RadioItem>
											<DropdownMenu.RadioItem value="other">Other</DropdownMenu.RadioItem>
										</DropdownMenu.RadioGroup>
									</DropdownMenu.Group>
								</DropdownMenu.SubContent>
							</DropdownMenu.Sub>
						</DropdownMenu.Group>
						<DropdownMenu.Separator />
						<DropdownMenu.Group>
							<DropdownMenu.Item variant="destructive">
								<Trash2Icon />
								Trash
							</DropdownMenu.Item>
						</DropdownMenu.Group>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</ButtonGroup.Root>
			<ButtonGroup.Root class="hidden sm:flex">
				<Button variant="outline" size="icon-sm" aria-label="Previous">
					<ArrowLeftIcon />
				</Button>
				<Button variant="outline" size="icon-sm" aria-label="Next">
					<ArrowRightIcon />
				</Button>
			</ButtonGroup.Root>
		</ButtonGroup.Root>
		<div class="flex gap-4">
			<ButtonGroup.Root class="hidden sm:flex">
				<ButtonGroup.Root>
					<Button variant="outline">1</Button>
					<Button variant="outline">2</Button>
					<Button variant="outline">3</Button>
				</ButtonGroup.Root>
			</ButtonGroup.Root>
			<ButtonGroup.Root>
				<ButtonGroup.Root>
					<Button variant="outline">Follow</Button>
					<DropdownMenu.Root>
						<DropdownMenu.Trigger>
							{#snippet child({ props })}
								<Button variant="outline" size="icon" {...props}>
									<ChevronDownIcon />
								</Button>
							{/snippet}
						</DropdownMenu.Trigger>
						<DropdownMenu.Content align="end" class="w-52">
							<DropdownMenu.Group>
								<DropdownMenu.Label>Quick Actions</DropdownMenu.Label>
								<DropdownMenu.Item>
									<VolumeXIcon />
									Mute Conversation
								</DropdownMenu.Item>
								<DropdownMenu.Item>
									<CheckIcon />
									Mark as Read
								</DropdownMenu.Item>
								<DropdownMenu.Item>
									<UserRoundXIcon />
									Block User
								</DropdownMenu.Item>
							</DropdownMenu.Group>
							<DropdownMenu.Separator />
							<DropdownMenu.Group>
								<DropdownMenu.Label>Conversation</DropdownMenu.Label>
								<DropdownMenu.Item>
									<ShareIcon />
									Share Conversation
								</DropdownMenu.Item>
								<DropdownMenu.Item>
									<CopyIcon />
									Copy Conversation
								</DropdownMenu.Item>
								<DropdownMenu.Item>
									<AlertTriangleIcon />
									Report Conversation
								</DropdownMenu.Item>
							</DropdownMenu.Group>
							<DropdownMenu.Separator />
							<DropdownMenu.Group>
								<DropdownMenu.Item variant="destructive">
									<TrashIcon />
									Delete Conversation
								</DropdownMenu.Item>
							</DropdownMenu.Group>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</ButtonGroup.Root>
				<ButtonGroup.Root>
					<Button variant="outline">
						<BotIcon />
						Copilot
					</Button>
					<Popover.Root>
						<Popover.Trigger>
							{#snippet child({ props })}
								<Button variant="outline" size="icon" aria-label="Open Popover" {...props}>
									<ChevronDownIcon />
								</Button>
							{/snippet}
						</Popover.Trigger>
						<Popover.Content align="end" class="w-96">
							<Popover.Header>
								<Popover.Title>Agent Tasks</Popover.Title>
								<Popover.Description>
									Describe your task in natural language. Copilot will work in the background and
									open a pull request.
								</Popover.Description>
							</Popover.Header>
							<div class="text-sm *:[p:not(:last-child)]:mb-2">
								<Textarea
									placeholder="Describe your task in natural language."
									class="min-h-32 resize-none"
								/>
							</div>
						</Popover.Content>
					</Popover.Root>
				</ButtonGroup.Root>
			</ButtonGroup.Root>
		</div>
	</div>
</Example>
