<script lang="ts">
	import ExampleWrapper from '../example-wrapper.svelte';
	import TextareaBasic from './textarea-basic.svelte';
	import TextareaDisabled from './textarea-disabled.svelte';
	import TextareaInvalid from './textarea-invalid.svelte';
	import TextareaWithDescription from './textarea-with-description.svelte';
	import TextareaWithLabel from './textarea-with-label.svelte';
</script>

<ExampleWrapper>
	<TextareaBasic />
	<TextareaInvalid />
	<TextareaWithLabel />
	<TextareaWithDescription />
	<TextareaDisabled />
</ExampleWrapper>
