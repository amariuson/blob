<script lang="ts">
	import ExampleWrapper from '../example-wrapper.svelte';
	import AlertBasic from './alert-basic.svelte';
	import AlertDestructive from './alert-destructive.svelte';
	import AlertWithActions from './alert-with-actions.svelte';
	import AlertWithIcons from './alert-with-icons.svelte';
</script>

<ExampleWrapper class="lg:grid-cols-1">
	<AlertBasic />
	<AlertWithIcons />
	<AlertDestructive />
	<AlertWithActions />
</ExampleWrapper>
