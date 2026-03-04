<script lang="ts">
	import ExampleWrapper from '../example-wrapper.svelte';
	import EmptyBasic from './empty-basic.svelte';
	import EmptyInCard from './empty-in-card.svelte';
	import EmptyWithBorder from './empty-with-border.svelte';
	import EmptyWithIcon from './empty-with-icon.svelte';
	import EmptyWithMutedBackground from './empty-with-muted-background.svelte';
	import EmptyWithMutedBackgroundAlt from './empty-with-muted-background-alt.svelte';
</script>

<ExampleWrapper>
	<EmptyBasic />
	<EmptyWithMutedBackground />
	<EmptyWithBorder />
	<EmptyWithIcon />
	<EmptyWithMutedBackgroundAlt />
	<EmptyInCard />
</ExampleWrapper>
