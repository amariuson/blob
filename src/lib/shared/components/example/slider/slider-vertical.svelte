<script lang="ts">
	import { Slider } from '$lib/shared/components/ui/slider/index.js';

	import Example from '../example.svelte';
</script>

<Example title="Vertical">
	<div class="flex items-center gap-6">
		<Slider type="single" value={50} max={100} step={1} orientation="vertical" class="h-40" />
		<Slider type="single" value={25} max={100} step={1} orientation="vertical" class="h-40" />
	</div>
</Example>
