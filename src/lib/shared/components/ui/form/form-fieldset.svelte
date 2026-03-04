<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPath<T>">
	import type { FormPath } from 'sveltekit-superforms';

	import { cn, type WithoutChild } from '$lib/shared/utils.js';

	import * as FormPrimitive from 'formsnap';

	let {
		ref = $bindable(null),
		class: className,
		form,
		name,
		...restProps
	}: WithoutChild<FormPrimitive.FieldsetProps<T, U>> = $props();
</script>

<FormPrimitive.Fieldset bind:ref {form} {name} class={cn('space-y-2', className)} {...restProps} />
