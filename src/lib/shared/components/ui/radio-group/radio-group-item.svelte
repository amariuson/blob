<script lang="ts">
	import { cn, type WithoutChildrenOrChild } from '$lib/shared/utils.js';

	import { RadioGroup as RadioGroupPrimitive } from 'bits-ui';
	import CircleIcon from '@lucide/svelte/icons/circle';

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: WithoutChildrenOrChild<RadioGroupPrimitive.ItemProps> = $props();
</script>

<RadioGroupPrimitive.Item
	bind:ref
	data-slot="radio-group-item"
	class={cn(
		'group/radio-group-item peer relative flex aspect-square size-4 shrink-0 rounded-full border border-input text-primary outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40',
		className
	)}
	{...restProps}
>
	{#snippet children({ checked })}
		<div
			data-slot="radio-group-indicator"
			class="flex size-4 items-center justify-center text-primary group-aria-invalid/radio-group-item:text-destructive"
		>
			{#if checked}
				<CircleIcon
					class="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 fill-current"
				/>
			{/if}
		</div>
	{/snippet}
</RadioGroupPrimitive.Item>
