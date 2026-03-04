<script lang="ts">
	import { Slider } from '$lib/shared/components/ui/slider/index.js';

	import Example from '../example.svelte';
</script>

<Example title="Basic">
	<Slider type="single" value={50} max={100} step={1} />
</Example>
