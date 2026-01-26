<script lang="ts">
	import { cn } from '$lib/shared/utils.js';

	import { Calendar as CalendarPrimitive } from 'bits-ui';

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: CalendarPrimitive.GridBodyProps = $props();
</script>

<CalendarPrimitive.GridBody bind:ref class={cn(className)} {...restProps} />
