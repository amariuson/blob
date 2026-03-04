<script lang="ts">
	import type { Snippet } from 'svelte';

	import * as Dialog from '$lib/shared/components/ui/dialog/index.js';
	import { cn, type WithoutChildrenOrChild } from '$lib/shared/utils.js';

	import type { Command as CommandPrimitive, Dialog as DialogPrimitive } from 'bits-ui';

	import Command from './command.svelte';

	let {
		open = $bindable(false),
		ref = $bindable(null),
		value = $bindable(''),
		title = 'Command Palette',
		description = 'Search for a command to run...',
		showCloseButton = false,
		portalProps,
		children,
		class: className,
		...restProps
	}: WithoutChildrenOrChild<DialogPrimitive.RootProps> &
		WithoutChildrenOrChild<CommandPrimitive.RootProps> & {
			portalProps?: DialogPrimitive.PortalProps;
			children: Snippet;
			title?: string;
			description?: string;
			showCloseButton?: boolean;
			class?: string;
		} = $props();
</script>

<Dialog.Root bind:open {...restProps}>
	<Dialog.Header class="sr-only">
		<Dialog.Title>{title}</Dialog.Title>
		<Dialog.Description>{description}</Dialog.Description>
	</Dialog.Header>
	<Dialog.Content
		class={cn('overflow-hidden rounded-xl! p-0', className)}
		{showCloseButton}
		{portalProps}
	>
		<Command {...restProps} bind:value bind:ref {children} />
	</Dialog.Content>
</Dialog.Root>
