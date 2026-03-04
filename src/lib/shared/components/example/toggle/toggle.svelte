<script lang="ts">
	import ExampleWrapper from '../example-wrapper.svelte';
	import ToggleBasic from './toggle-basic.svelte';
	import ToggleDisabled from './toggle-disabled.svelte';
	import ToggleOutline from './toggle-outline.svelte';
	import ToggleSizes from './toggle-sizes.svelte';
	import ToggleWithButtonIcon from './toggle-with-button-icon.svelte';
	import ToggleWithButtonIconText from './toggle-with-button-icon-text.svelte';
	import ToggleWithButtonText from './toggle-with-button-text.svelte';
	import ToggleWithIcon from './toggle-with-icon.svelte';
</script>

<ExampleWrapper>
	<ToggleBasic />
	<ToggleOutline />
	<ToggleSizes />
	<ToggleWithButtonText />
	<ToggleWithButtonIcon />
	<ToggleWithButtonIconText />
	<ToggleDisabled />
	<ToggleWithIcon />
</ExampleWrapper>
