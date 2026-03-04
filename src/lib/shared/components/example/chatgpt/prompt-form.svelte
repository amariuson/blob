<script lang="ts">
	import * as DropdownMenu from '$lib/shared/components/ui/dropdown-menu/index.js';
	import * as Field from '$lib/shared/components/ui/field/index.js';
	import * as InputGroup from '$lib/shared/components/ui/input-group/index.js';
	import * as Kbd from '$lib/shared/components/ui/kbd/index.js';
	import * as Tooltip from '$lib/shared/components/ui/tooltip/index.js';

	import ArrowUpIcon from '@lucide/svelte/icons/arrow-up';
	import AudioLinesIcon from '@lucide/svelte/icons/audio-lines';
	import BookOpenIcon from '@lucide/svelte/icons/book-open';
	import GlobeIcon from '@lucide/svelte/icons/globe';
	import MoreHorizontalIcon from '@lucide/svelte/icons/more-horizontal';
	import MousePointerIcon from '@lucide/svelte/icons/mouse-pointer';
	import PaperclipIcon from '@lucide/svelte/icons/paperclip';
	import PenToolIcon from '@lucide/svelte/icons/pen-tool';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import ShareIcon from '@lucide/svelte/icons/share';
	import ShoppingBagIcon from '@lucide/svelte/icons/shopping-bag';
	import SparklesIcon from '@lucide/svelte/icons/sparkles';
	import WandIcon from '@lucide/svelte/icons/wand';

	import Example from '../example.svelte';
	let dictateEnabled = $state(false);
</script>

<Example title="Prompt Form">
	<Field.Field>
		<Field.Label for="prompt" class="sr-only">Prompt</Field.Label>
		<InputGroup.Root>
			<InputGroup.Textarea id="prompt" placeholder="Ask anything" />
			<InputGroup.Addon align="block-end">
				<Tooltip.Root>
					<DropdownMenu.Root>
						<Tooltip.Trigger>
							{#snippet child({ props })}
								<DropdownMenu.Trigger>
									{#snippet child({ props: triggerProps })}
										<InputGroup.Button
											variant="ghost"
											size="icon-sm"
											onclick={() => (dictateEnabled = !dictateEnabled)}
											class="rounded-4xl"
											{...props}
											{...triggerProps}
										>
											<PlusIcon />
										</InputGroup.Button>
									{/snippet}
								</DropdownMenu.Trigger>
							{/snippet}
						</Tooltip.Trigger>
						<Tooltip.Content>
							Add files and more <Kbd.Root>/</Kbd.Root>
						</Tooltip.Content>
						<DropdownMenu.Content class="w-56">
							<DropdownMenu.Group>
								<DropdownMenu.Item>
									<PaperclipIcon />
									Add photos & files
								</DropdownMenu.Item>
								<DropdownMenu.Item>
									<SparklesIcon />
									Deep research
								</DropdownMenu.Item>
								<DropdownMenu.Item>
									<ShoppingBagIcon />
									Shopping research
								</DropdownMenu.Item>
								<DropdownMenu.Item>
									<WandIcon />
									Create image
								</DropdownMenu.Item>
								<Tooltip.Root>
									<Tooltip.Trigger>
										{#snippet child({ props })}
											<DropdownMenu.Item {...props}>
												<MousePointerIcon />
												Agent mode
											</DropdownMenu.Item>
										{/snippet}
									</Tooltip.Trigger>
									<Tooltip.Content side="right">
										<div class="font-medium">35 left</div>
										<div class="text-xs text-primary-foreground/80">
											More available for purchase
										</div>
									</Tooltip.Content>
								</Tooltip.Root>
							</DropdownMenu.Group>
							<DropdownMenu.Sub>
								<DropdownMenu.SubTrigger>
									<MoreHorizontalIcon />
									More
								</DropdownMenu.SubTrigger>
								<DropdownMenu.SubContent>
									<DropdownMenu.Group>
										<DropdownMenu.Item>
											<ShareIcon />
											Add sources
										</DropdownMenu.Item>
										<DropdownMenu.Item>
											<BookOpenIcon />
											Study and learn
										</DropdownMenu.Item>
										<DropdownMenu.Item>
											<GlobeIcon />
											Web search
										</DropdownMenu.Item>
										<DropdownMenu.Item>
											<PenToolIcon />
											Canvas
										</DropdownMenu.Item>
									</DropdownMenu.Group>
								</DropdownMenu.SubContent>
							</DropdownMenu.Sub>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</Tooltip.Root>
				<Tooltip.Root>
					<Tooltip.Trigger>
						{#snippet child({ props })}
							<InputGroup.Button
								variant="ghost"
								size="icon-sm"
								onclick={() => (dictateEnabled = !dictateEnabled)}
								class="ml-auto rounded-4xl"
								{...props}
							>
								<AudioLinesIcon />
							</InputGroup.Button>
						{/snippet}
					</Tooltip.Trigger>
					<Tooltip.Content>Dictate</Tooltip.Content>
				</Tooltip.Root>
				<InputGroup.Button size="icon-sm" variant="default" class="rounded-4xl">
					<ArrowUpIcon />
				</InputGroup.Button>
			</InputGroup.Addon>
		</InputGroup.Root>
	</Field.Field>
</Example>
