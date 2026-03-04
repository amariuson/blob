<script lang="ts">
	import { Button } from '$lib/shared/components/ui/button/index.js';
	import * as ButtonGroup from '$lib/shared/components/ui/button-group/index.js';
	import * as DropdownMenu from '$lib/shared/components/ui/dropdown-menu/index.js';
	import * as Field from '$lib/shared/components/ui/field/index.js';
	import * as InputGroup from '$lib/shared/components/ui/input-group/index.js';
	import { Label } from '$lib/shared/components/ui/label/index.js';
	import * as Popover from '$lib/shared/components/ui/popover/index.js';
	import { Separator } from '$lib/shared/components/ui/separator/index.js';
	import * as Tooltip from '$lib/shared/components/ui/tooltip/index.js';

	import ArrowUpIcon from '@lucide/svelte/icons/arrow-up';
	import AudioLinesIcon from '@lucide/svelte/icons/audio-lines';
	import InfoIcon from '@lucide/svelte/icons/info';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import SearchIcon from '@lucide/svelte/icons/search';
	import StarIcon from '@lucide/svelte/icons/star';

	import Example from '../example.svelte';
	let isFavorite = $state(false);
	let voiceEnabled = $state(false);
</script>

<Example title="Input Group">
	<div class="flex flex-col gap-6">
		<InputGroup.Root>
			<InputGroup.Input placeholder="Search..." />
			<InputGroup.Addon>
				<SearchIcon />
			</InputGroup.Addon>
			<InputGroup.Addon align="inline-end">12 results</InputGroup.Addon>
		</InputGroup.Root>
		<InputGroup.Root>
			<InputGroup.Input placeholder="example.com" class="pl-1!" />
			<InputGroup.Addon>
				<InputGroup.Text>https://</InputGroup.Text>
			</InputGroup.Addon>
			<InputGroup.Addon align="inline-end">
				<Tooltip.Root>
					<Tooltip.Trigger>
						{#snippet child({ props })}
							<InputGroup.Button class="rounded-full" size="icon-xs" aria-label="Info" {...props}>
								<InfoIcon />
							</InputGroup.Button>
						{/snippet}
					</Tooltip.Trigger>
					<Tooltip.Content>This is content in a tooltip.</Tooltip.Content>
				</Tooltip.Root>
			</InputGroup.Addon>
		</InputGroup.Root>
		<Field.Field>
			<Label for="input-secure-19" class="sr-only">Input Secure</Label>
			<InputGroup.Root>
				<InputGroup.Input id="input-secure-19" class="pl-0.5!" />
				<InputGroup.Addon>
					<Popover.Root>
						<Popover.Trigger>
							{#snippet child({ props })}
								<InputGroup.Button variant="secondary" size="icon-xs" aria-label="Info" {...props}>
									<InfoIcon />
								</InputGroup.Button>
							{/snippet}
						</Popover.Trigger>
						<Popover.Content
							align="start"
							alignOffset={10}
							class="flex flex-col gap-1 rounded-xl text-sm"
						>
							<p class="font-medium">Your connection is not secure.</p>
							<p>You should not enter any sensitive information on this site.</p>
						</Popover.Content>
					</Popover.Root>
				</InputGroup.Addon>
				<InputGroup.Addon class="pl-1! text-muted-foreground">https://</InputGroup.Addon>
				<InputGroup.Addon align="inline-end">
					<InputGroup.Button
						onclick={() => (isFavorite = !isFavorite)}
						size="icon-xs"
						aria-label="Favorite"
					>
						<StarIcon
							data-favorite={isFavorite}
							class="data-[favorite=true]:fill-primary data-[favorite=true]:stroke-primary"
						/>
					</InputGroup.Button>
				</InputGroup.Addon>
			</InputGroup.Root>
		</Field.Field>
		<ButtonGroup.Root class="w-full">
			<ButtonGroup.Root>
				<Button variant="outline" size="icon" aria-label="Add">
					<PlusIcon />
				</Button>
			</ButtonGroup.Root>
			<ButtonGroup.Root class="flex-1">
				<InputGroup.Root>
					<InputGroup.Input
						placeholder={voiceEnabled ? 'Record and send audio...' : 'Send a message...'}
						disabled={voiceEnabled}
					/>
					<InputGroup.Addon align="inline-end">
						<Tooltip.Root>
							<Tooltip.Trigger>
								{#snippet child({ props })}
									<InputGroup.Button
										onclick={() => (voiceEnabled = !voiceEnabled)}
										data-active={voiceEnabled}
										class="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
										aria-pressed={voiceEnabled}
										size="icon-xs"
										aria-label="Voice Mode"
										{...props}
									>
										<AudioLinesIcon />
									</InputGroup.Button>
								{/snippet}
							</Tooltip.Trigger>
							<Tooltip.Content>Voice Mode</Tooltip.Content>
						</Tooltip.Root>
					</InputGroup.Addon>
				</InputGroup.Root>
			</ButtonGroup.Root>
		</ButtonGroup.Root>
		<InputGroup.Root>
			<InputGroup.Textarea placeholder="Ask, Search or Chat..." />
			<InputGroup.Addon align="block-end">
				<InputGroup.Button
					variant="outline"
					class="style-lyra:rounded-none rounded-full"
					size="icon-xs"
					aria-label="Add"
				>
					<PlusIcon />
				</InputGroup.Button>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						{#snippet child({ props })}
							<InputGroup.Button variant="ghost" {...props}>Auto</InputGroup.Button>
						{/snippet}
					</DropdownMenu.Trigger>
					<DropdownMenu.Content side="top" align="start" class="[--radius:0.95rem]">
						<DropdownMenu.Group>
							<DropdownMenu.Item>Auto</DropdownMenu.Item>
							<DropdownMenu.Item>Agent</DropdownMenu.Item>
							<DropdownMenu.Item>Manual</DropdownMenu.Item>
						</DropdownMenu.Group>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
				<InputGroup.Text class="ml-auto">52% used</InputGroup.Text>
				<Separator orientation="vertical" class="h-4!" />
				<InputGroup.Button
					variant="default"
					class="style-lyra:rounded-none rounded-full"
					size="icon-xs"
				>
					<ArrowUpIcon />
					<span class="sr-only">Send</span>
				</InputGroup.Button>
			</InputGroup.Addon>
		</InputGroup.Root>
	</div>
</Example>
