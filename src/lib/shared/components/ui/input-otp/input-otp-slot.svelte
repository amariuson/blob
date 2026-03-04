<script lang="ts">
	import { cn } from '$lib/shared/utils.js';

	import { PinInput as InputOTPPrimitive } from 'bits-ui';

	let {
		ref = $bindable(null),
		cell,
		class: className,
		...restProps
	}: InputOTPPrimitive.CellProps = $props();
</script>

<InputOTPPrimitive.Cell
	{cell}
	bind:ref
	data-slot="input-otp-slot"
	class={cn(
		'relative flex size-8 items-center justify-center border-y border-r border-input text-sm transition-all outline-none first:rounded-l-lg first:border-l last:rounded-r-lg aria-invalid:border-destructive data-[active=true]:z-10 dark:bg-input/30 data-active:border-ring data-active:ring-[3px] data-active:ring-ring/50 data-active:aria-invalid:border-destructive data-active:aria-invalid:ring-destructive/20 dark:data-active:aria-invalid:ring-destructive/40',
		className
	)}
	{...restProps}
>
	{cell.char}
	{#if cell.hasFakeCaret}
		<div class=" pointer-events-none absolute inset-0 flex items-center justify-center">
			<div class="h-4 w-px animate-caret-blink bg-foreground duration-1000"></div>
		</div>
	{/if}
</InputOTPPrimitive.Cell>
