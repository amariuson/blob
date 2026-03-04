<script lang="ts">
	import { buttonVariants } from '$lib/shared/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/shared/components/ui/dropdown-menu/index.js';
	import * as Item from '$lib/shared/components/ui/item/index.js';
	import { cn } from '$lib/shared/utils';

	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';

	import Example from '../example.svelte';

	let mode = $state('auto');
	let model = $state('gpt-5.1');
</script>

<Example title="Model Selector">
	<DropdownMenu.Root>
		<DropdownMenu.Trigger class={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'gap-2')}>
			ChatGPT 5.1
			<ChevronDownIcon class="size-4 text-muted-foreground" />
		</DropdownMenu.Trigger>
		<DropdownMenu.Content class="w-60" align="start">
			<DropdownMenu.Group>
				<DropdownMenu.Label class="text-xs font-normal text-muted-foreground">
					GPT-5.1
				</DropdownMenu.Label>
				<DropdownMenu.RadioGroup bind:value={mode}>
					<DropdownMenu.RadioItem value="auto">
						<Item.Root size="xs" class="p-0">
							<Item.Content>
								<Item.Title>Auto</Item.Title>
								<Item.Description class="text-xs">Decides how long to think</Item.Description>
							</Item.Content>
						</Item.Root>
					</DropdownMenu.RadioItem>
					<DropdownMenu.RadioItem value="instant">
						<Item.Root size="xs" class="p-0">
							<Item.Content>
								<Item.Title>Instant</Item.Title>
								<Item.Description class="text-xs">Answers right away</Item.Description>
							</Item.Content>
						</Item.Root>
					</DropdownMenu.RadioItem>
					<DropdownMenu.RadioItem value="thinking">
						<Item.Root size="xs" class="p-0">
							<Item.Content>
								<Item.Title>Thinking</Item.Title>
								<Item.Description class="text-xs">
									Thinks longer for better answers
								</Item.Description>
							</Item.Content>
						</Item.Root>
					</DropdownMenu.RadioItem>
				</DropdownMenu.RadioGroup>
			</DropdownMenu.Group>
			<DropdownMenu.Separator />
			<DropdownMenu.Sub>
				<DropdownMenu.SubTrigger>
					<span class="font-medium">Legacy models</span>
				</DropdownMenu.SubTrigger>
				<DropdownMenu.SubContent>
					<DropdownMenu.Group>
						<DropdownMenu.RadioGroup bind:value={model}>
							<DropdownMenu.RadioItem value="gpt-4">GPT-4</DropdownMenu.RadioItem>
							<DropdownMenu.RadioItem value="gpt-4-turbo">GPT-4 Turbo</DropdownMenu.RadioItem>
							<DropdownMenu.RadioItem value="gpt-3.5">GPT-3.5</DropdownMenu.RadioItem>
						</DropdownMenu.RadioGroup>
					</DropdownMenu.Group>
				</DropdownMenu.SubContent>
			</DropdownMenu.Sub>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</Example>
