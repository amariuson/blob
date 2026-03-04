<script lang="ts">
	import ExampleWrapper from '../example-wrapper.svelte';
	import SeparatorHorizontal from './separator-horizontal.svelte';
	import SeparatorInList from './separator-in-list.svelte';
	import SeparatorVertical from './separator-vertical.svelte';
	import SeparatorVerticalMenu from './separator-vertical-menu.svelte';
</script>

<ExampleWrapper class="w-full max-w-4xl lg:grid-cols-1 2xl:max-w-4xl 2xl:grid-cols-1">
	<SeparatorHorizontal />
	<SeparatorVertical />
	<SeparatorVerticalMenu />
	<SeparatorInList />
</ExampleWrapper>
