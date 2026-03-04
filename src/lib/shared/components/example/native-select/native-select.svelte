<script lang="ts">
	import ExampleWrapper from '../example-wrapper.svelte';
	import NativeSelectBasic from './native-select-basic.svelte';
	import NativeSelectDisabled from './native-select-disabled.svelte';
	import NativeSelectInvalid from './native-select-invalid.svelte';
	import NativeSelectSizes from './native-select-sizes.svelte';
	import NativeSelectWithField from './native-select-with-field.svelte';
	import NativeSelectWithGroups from './native-select-with-groups.svelte';
</script>

<ExampleWrapper>
	<NativeSelectBasic />
	<NativeSelectWithGroups />
	<NativeSelectSizes />
	<NativeSelectWithField />
	<NativeSelectDisabled />
	<NativeSelectInvalid />
</ExampleWrapper>
