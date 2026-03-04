<script lang="ts">
	import ExampleWrapper from '../example-wrapper.svelte';
	import FieldCheckboxFields from './field-checkbox-fields.svelte';
	import FieldInputFields from './field-input-fields.svelte';
	import FieldInputOTPFields from './field-input-otp-fields.svelte';
	import FieldNativeSelectFields from './field-native-select-fields.svelte';
	import FieldRadioFields from './field-radio-fields.svelte';
	import FieldSelectFields from './field-select-fields.svelte';
	import FieldSliderFields from './field-slider-fields.svelte';
	import FieldSwitchFields from './field-switch-fields.svelte';
	import FieldTextareaFields from './field-textarea-fields.svelte';
</script>

<ExampleWrapper>
	<FieldInputFields />
	<FieldTextareaFields />
	<FieldSelectFields />
	<FieldCheckboxFields />
	<FieldRadioFields />
	<FieldSwitchFields />
	<FieldSliderFields />
	<FieldNativeSelectFields />
	<FieldInputOTPFields />
</ExampleWrapper>
