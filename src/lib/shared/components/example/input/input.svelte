<script lang="ts">
	import ExampleWrapper from '../example-wrapper.svelte';
	import InputBasic from './input-basic.svelte';
	import InputDisabled from './input-disabled.svelte';
	import InputForm from './input-form.svelte';
	import InputInvalid from './input-invalid.svelte';
	import InputTypes from './input-types.svelte';
	import InputWithButton from './input-with-button.svelte';
	import InputWithDescription from './input-with-description.svelte';
	import InputWithLabel from './input-with-label.svelte';
	import InputWithNativeSelect from './input-with-native-select.svelte';
	import InputWithSelect from './input-with-select.svelte';
</script>

<ExampleWrapper>
	<InputBasic />
	<InputInvalid />
	<InputWithLabel />
	<InputWithDescription />
	<InputDisabled />
	<InputTypes />
	<InputWithSelect />
	<InputWithButton />
	<InputWithNativeSelect />
	<InputForm />
</ExampleWrapper>
