<script lang="ts">
	import ExampleWrapper from '../example-wrapper.svelte';
	import SliderBasic from './slider-basic.svelte';
	import SliderControlled from './slider-controlled.svelte';
	import SliderDisabled from './slider-disabled.svelte';
	import SliderMultiple from './slider-multiple.svelte';
	import SliderRange from './slider-range.svelte';
	import SliderVertical from './slider-vertical.svelte';
</script>

<ExampleWrapper>
	<SliderBasic />
	<SliderRange />
	<SliderMultiple />
	<SliderVertical />
	<SliderControlled />
	<SliderDisabled />
</ExampleWrapper>
