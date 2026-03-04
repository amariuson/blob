<script lang="ts">
	import * as Button from '$lib/shared/components/ui/button/index.js';
	import * as Input from '$lib/shared/components/ui/input/index.js';

	import Example from '../example.svelte';
</script>

<Example title="With Button">
	<div class="flex w-full gap-2">
		<Input.Root type="search" placeholder="Search..." class="flex-1" />
		<Button.Root>Search</Button.Root>
	</div>
</Example>
