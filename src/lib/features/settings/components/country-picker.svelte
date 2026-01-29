<script lang="ts">
	import { Button } from '$lib/shared/components/ui/button/index.js';
	import * as Command from '$lib/shared/components/ui/command/index.js';
	import * as Popover from '$lib/shared/components/ui/popover/index.js';
	import { cn } from '$lib/shared/utils';

	import Check from '@lucide/svelte/icons/check';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';

	import { ALL_COUNTRIES, COUNTRIES_BY_CONTINENT } from '../logic/countries';

	interface Props {
		value?: string | null;
		onchange?: (code: string | null) => void;
		name?: string;
		placeholder?: string;
		disabled?: boolean;
	}

	let {
		value = null,
		onchange,
		name,
		placeholder = 'Select country',
		disabled = false
	}: Props = $props();

	let open = $state(false);

	const selectedCountry = $derived(ALL_COUNTRIES.find((c) => c.code === value));

	function handleSelect(code: string) {
		const newValue = code || null;
		value = newValue;
		onchange?.(newValue);
		open = false;
	}
</script>

<Popover.Root bind:open>
	<Popover.Trigger>
		{#snippet child({ props })}
			<Button
				variant="outline"
				role="combobox"
				aria-expanded={open}
				class="w-full justify-between bg-background px-3 font-normal hover:bg-background"
				{disabled}
				{...props}
			>
				{#if selectedCountry}
					<span class="flex min-w-0 items-center gap-2">
						<span class="text-lg leading-none">{selectedCountry.flag}</span>
						<span class="truncate">{selectedCountry.name}</span>
					</span>
				{:else}
					<span class="text-muted-foreground">{placeholder}</span>
				{/if}
				<ChevronDown size={16} class="shrink-0 text-muted-foreground/80" aria-hidden="true" />
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-full min-w-[var(--bits-popover-anchor-width)] p-0" align="start">
		<Command.Root>
			<Command.Input placeholder="Search country..." />
			<Command.List class="max-h-[300px]">
				<Command.Empty>No country found.</Command.Empty>
				{#each COUNTRIES_BY_CONTINENT as group (group.continent)}
					<Command.Group heading={group.continent}>
						{#each group.countries as country (country.code)}
							<Command.Item
								value={`${country.name} ${country.code}`}
								onSelect={() => handleSelect(country.code)}
							>
								<span class="text-lg leading-none">{country.flag}</span>
								{country.name}
								<Check
									class={cn('ml-auto', value === country.code ? 'opacity-100' : 'opacity-0')}
								/>
							</Command.Item>
						{/each}
					</Command.Group>
				{/each}
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>

{#if name}
	<input type="hidden" {name} value={value ?? ''} />
{/if}
