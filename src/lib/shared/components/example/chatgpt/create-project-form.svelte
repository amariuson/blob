<script lang="ts">
	import { Alert, AlertDescription } from '$lib/shared/components/ui/alert/index.js';
	import { badgeVariants } from '$lib/shared/components/ui/badge/index.js';
	import { Button } from '$lib/shared/components/ui/button/index.js';
	import * as Card from '$lib/shared/components/ui/card/index.js';
	import * as DropdownMenu from '$lib/shared/components/ui/dropdown-menu/index.js';
	import * as Field from '$lib/shared/components/ui/field/index.js';
	import * as InputGroup from '$lib/shared/components/ui/input-group/index.js';
	import * as Item from '$lib/shared/components/ui/item/index.js';
	import * as Popover from '$lib/shared/components/ui/popover/index.js';
	import { cn } from '$lib/shared/utils';

	import CircleCheckIcon from '@lucide/svelte/icons/circle-check';
	import FolderIcon from '@lucide/svelte/icons/folder';
	import LightbulbIcon from '@lucide/svelte/icons/lightbulb';
	import SettingsIcon from '@lucide/svelte/icons/settings';

	import Example from '../example.svelte';

	const categories = [
		{
			id: 'homework',
			label: 'Homework'
		},
		{
			id: 'writing',
			label: 'Writing'
		},
		{
			id: 'health',
			label: 'Health'
		},
		{
			id: 'travel',
			label: 'Travel'
		}
	];

	let projectName = $state('');
	let selectedCategory = $state<string | null>(categories[0].id);
	let memorySetting = $state<'default' | 'project-only'>('default');
	let selectedColor = $state<string | null>('var(--foreground)');
</script>

<Example title="Create Project" class="items-center justify-center">
	<Card.Root class="w-full max-w-sm">
		<Card.Header>
			<Card.Title>Create Project</Card.Title>
			<Card.Description>
				Start a new project to keep chats, files, and custom instructions in one place.
			</Card.Description>
			<Card.Action>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						{#snippet child({ props })}
							<Button variant="ghost" size="icon" {...props}>
								<SettingsIcon />
								<span class="sr-only">Memory</span>
							</Button>
						{/snippet}
					</DropdownMenu.Trigger>
					<DropdownMenu.Content align="end" class="w-72">
						<DropdownMenu.Group>
							<DropdownMenu.RadioGroup bind:value={memorySetting}>
								<DropdownMenu.RadioItem value="default">
									<Item.Root size="xs">
										<Item.Content>
											<Item.Title>Default</Item.Title>
											<Item.Description class="text-xs">
												Project can access memories from outside chats, and vice versa.
											</Item.Description>
										</Item.Content>
									</Item.Root>
								</DropdownMenu.RadioItem>
								<DropdownMenu.RadioItem value="project-only">
									<Item.Root size="xs">
										<Item.Content>
											<Item.Title>Project Only</Item.Title>
											<Item.Description class="text-xs">
												Project can only access its own memories. Its memories are hidden from
												outside chats.
											</Item.Description>
										</Item.Content>
									</Item.Root>
								</DropdownMenu.RadioItem>
							</DropdownMenu.RadioGroup>
						</DropdownMenu.Group>
						<DropdownMenu.Separator />
						<DropdownMenu.Group>
							<DropdownMenu.Label>
								Note that this setting can&apos;t be changed later.
							</DropdownMenu.Label>
						</DropdownMenu.Group>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</Card.Action>
		</Card.Header>
		<Card.Content>
			<Field.Group>
				<Field.Field>
					<Field.Label for="project-name" class="sr-only">Project Name</Field.Label>
					<InputGroup.Root>
						<InputGroup.Input
							id="project-name"
							placeholder="Copenhagen Trip"
							value={projectName}
							oninput={(e) => {
								projectName = e.currentTarget.value;
							}}
						/>
						<InputGroup.Addon>
							<Popover.Root>
								<Popover.Trigger>
									{#snippet child({ props })}
										<InputGroup.Button variant="ghost" size="icon-xs" {...props}>
											<FolderIcon style={`--color: ${selectedColor}`} class="text-(--color)" />
										</InputGroup.Button>
									{/snippet}
								</Popover.Trigger>
								<Popover.Content align="start" class="w-60 p-3">
									<div class="flex flex-wrap gap-2">
										{#each ['var(--foreground)', '#fa423e', '#f59e0b', '#8b5cf6', '#ec4899', '#10b981', '#6366f1', '#14b8a6', '#f97316', '#fbbc04'] as color (color)}
											<Button
												size="icon"
												variant="ghost"
												class="rounded-full p-1"
												style={`--color: ${color}`}
												data-checked={selectedColor === color}
												onclick={() => {
													selectedColor = color;
												}}
											>
												<span
													class="size-5 rounded-full bg-(--color) ring-2 ring-transparent ring-offset-2 ring-offset-(--color) group-data-[checked=true]/button:ring-(--color) group-data-[checked=true]/button:ring-offset-background"
												></span>
												<span class="sr-only">{color}</span>
											</Button>
										{/each}
									</div>
								</Popover.Content>
							</Popover.Root>
						</InputGroup.Addon>
					</InputGroup.Root>
					<Field.Description class="flex flex-wrap gap-2">
						{#each categories as category (category.id)}
							<button
								type="button"
								onclick={() => {
									selectedCategory = selectedCategory === category.id ? null : category.id;
								}}
								data-checked={selectedCategory === category.id}
								class={cn(
									badgeVariants({
										variant: selectedCategory === category.id ? 'default' : 'outline'
									}),
									'group/badge cursor-pointer'
								)}
							>
								<CircleCheckIcon
									data-icon="inline-start"
									class="hidden group-data-[checked=true]/badge:inline"
								/>
								{category.label}
							</button>
						{/each}
					</Field.Description>
				</Field.Field>
				<Field.Field>
					<Alert class="bg-muted">
						<LightbulbIcon />
						<AlertDescription class="text-xs">
							Projects keep chats, files, and custom instructions in one place. Use them for ongoing
							work, or just to keep things tidy.
						</AlertDescription>
					</Alert>
				</Field.Field>
			</Field.Group>
		</Card.Content>
	</Card.Root>
</Example>
