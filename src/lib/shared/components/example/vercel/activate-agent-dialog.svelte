<script lang="ts">
	import * as Alert from '$lib/shared/components/ui/alert/index.js';
	import { Badge } from '$lib/shared/components/ui/badge/index.js';
	import { Button } from '$lib/shared/components/ui/button/index.js';
	import * as Dialog from '$lib/shared/components/ui/dialog/index.js';
	import * as Item from '$lib/shared/components/ui/item/index.js';

	import CheckCircle2Icon from '@lucide/svelte/icons/check-circle-2';
	import CircleDollarSignIcon from '@lucide/svelte/icons/circle-dollar-sign';

	import Example from '../example.svelte';
	const agentFeatures = [
		{
			id: 'code-reviews',
			title: 'Code reviews',
			description: 'with full codebase context to catch',
			highlight: 'hard-to-find',
			endText: 'bugs.'
		},
		{
			id: 'code-suggestions',
			title: 'Code suggestions',
			description: 'validated in sandboxes before you merge.'
		},
		{
			id: 'root-cause',
			title: 'Root-cause analysis',
			description: 'for production issues with deployment context.',
			hasBadge: true
		}
	];
</script>

<Example title="Activate Agent" class="items-center justify-center">
	<Dialog.Root>
		<Dialog.Trigger>
			{#snippet child({ props })}
				<Button variant="outline" {...props}>Activate Agent</Button>
			{/snippet}
		</Dialog.Trigger>
		<Dialog.Content showCloseButton={false}>
			<Dialog.Header>
				<Dialog.Title>Ship faster & safer with Vercel Agent</Dialog.Title>
				<Dialog.Description>
					Your use is subject to Vercel's
					<a href="#/">Public Beta Agreement</a> and
					<a href="#/">AI Product Terms</a>.
				</Dialog.Description>
			</Dialog.Header>
			<div class="no-scrollbar flex max-h-[50vh] flex-col gap-4 overflow-y-auto">
				<Item.Group class="gap-0 pr-2">
					{#each agentFeatures as feature (feature.id)}
						<Item.Root size="xs" class="px-0">
							<Item.Media variant="icon" class="self-start">
								<CheckCircle2Icon class="size-5 fill-primary text-primary-foreground" />
							</Item.Media>
							<Item.Content>
								<Item.Title
									class="inline leading-relaxed font-normal text-muted-foreground *:[strong]:font-medium *:[strong]:text-foreground"
								>
									<strong>{feature.title}</strong>
									{feature.description}
									{#if feature.highlight}
										<strong>{feature.highlight}</strong> {feature.endText}
									{/if}
									{#if feature.hasBadge}
										<Badge variant="secondary" class="bg-blue-100 text-blue-700 hover:bg-blue-100">
											Requires Observability Plus
										</Badge>
									{/if}
								</Item.Title>
							</Item.Content>
						</Item.Root>
					{/each}
				</Item.Group>
				<Alert.Root class="hidden sm:grid">
					<CircleDollarSignIcon />
					<Alert.Description>
						Pro teams get $100 in Vercel Agent trial credit for 2 weeks.
					</Alert.Description>
				</Alert.Root>
			</div>
			<Dialog.Footer>
				<Dialog.Close>
					{#snippet child({ props })}
						<Button variant="outline" {...props}>Cancel</Button>
					{/snippet}
				</Dialog.Close>
				<Button>Enable with $100 credits</Button>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>
</Example>
