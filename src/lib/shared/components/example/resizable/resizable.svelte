<script lang="ts">
	import ExampleWrapper from '../example-wrapper.svelte';
	import ResizableControlled from './resizable-controlled.svelte';
	import ResizableHorizontal from './resizable-horizontal.svelte';
	import ResizableNested from './resizable-nested.svelte';
	import ResizableVertical from './resizable-vertical.svelte';
	import ResizableWithHandle from './resizable-with-handle.svelte';
</script>

<ExampleWrapper>
	<ResizableHorizontal />
	<ResizableVertical />
	<ResizableWithHandle />
	<ResizableNested />
	<ResizableControlled />
</ExampleWrapper>
