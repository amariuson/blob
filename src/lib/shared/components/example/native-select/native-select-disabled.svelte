<script lang="ts">
	import * as NativeSelect from '$lib/shared/components/ui/native-select/index.js';

	import Example from '../example.svelte';
</script>

<Example title="Disabled">
	<NativeSelect.Root disabled>
		<NativeSelect.Option value="">Disabled</NativeSelect.Option>
		<NativeSelect.Option value="apple">Apple</NativeSelect.Option>
		<NativeSelect.Option value="banana">Banana</NativeSelect.Option>
		<NativeSelect.Option value="blueberry">Blueberry</NativeSelect.Option>
	</NativeSelect.Root>
</Example>
