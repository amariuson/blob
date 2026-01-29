<script lang="ts">
	import { Globe, Building2, Lock } from '@lucide/svelte';

	import * as Select from '$lib/shared/components/ui/select';

	import type { FileVisibility } from '$lib/server/db/schema';

	import { VISIBILITY_LABELS, VISIBILITY_DESCRIPTIONS } from '../constants';

	interface Props {
		value: FileVisibility;
		onchange?: (value: FileVisibility) => void;
		disabled?: boolean;
	}

	let { value = $bindable(), onchange, disabled = false }: Props = $props();

	function getVisibilityIcon(visibility: FileVisibility) {
		switch (visibility) {
			case 'public':
				return Globe;
			case 'organization':
				return Building2;
			case 'private':
				return Lock;
		}
	}

	const Icon = $derived(getVisibilityIcon(value));
</script>

<Select.Root
	type="single"
	{value}
	onValueChange={(v) => {
		if (v) {
			value = v as FileVisibility;
			onchange?.(v as FileVisibility);
		}
	}}
	{disabled}
>
	<Select.Trigger class="w-[180px]">
		<div class="flex items-center gap-2">
			<Icon class="h-4 w-4" />
			<span>{VISIBILITY_LABELS[value]}</span>
		</div>
	</Select.Trigger>
	<Select.Content>
		{#each ['private', 'organization', 'public'] as const as visibility}
			{@const VisIcon = getVisibilityIcon(visibility)}
			<Select.Item value={visibility}>
				<div class="flex items-center gap-2">
					<VisIcon class="h-4 w-4" />
					<div>
						<p class="font-medium">{VISIBILITY_LABELS[visibility]}</p>
						<p class="text-xs text-muted-foreground">{VISIBILITY_DESCRIPTIONS[visibility]}</p>
					</div>
				</div>
			</Select.Item>
		{/each}
	</Select.Content>
</Select.Root>
