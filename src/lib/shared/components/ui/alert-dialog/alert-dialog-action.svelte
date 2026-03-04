<script lang="ts">
	import {
		type ButtonSize,
		type ButtonVariant,
		buttonVariants
	} from '$lib/shared/components/ui/button/index.js';
	import { cn } from '$lib/shared/utils.js';

	import { AlertDialog as AlertDialogPrimitive } from 'bits-ui';

	let {
		ref = $bindable(null),
		class: className,
		variant = 'default',
		size = 'default',
		...restProps
	}: AlertDialogPrimitive.ActionProps & {
		variant?: ButtonVariant;
		size?: ButtonSize;
	} = $props();
</script>

<AlertDialogPrimitive.Action
	bind:ref
	data-slot="alert-dialog-action"
	class={cn(buttonVariants({ variant, size }), '', className)}
	{...restProps}
/>
