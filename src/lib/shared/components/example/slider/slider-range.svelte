<script lang="ts">
	import { Slider } from '$lib/shared/components/ui/slider/index.js';

	import Example from '../example.svelte';
</script>

<Example title="Range">
	<Slider type="multiple" value={[25, 50]} max={100} step={5} />
</Example>
