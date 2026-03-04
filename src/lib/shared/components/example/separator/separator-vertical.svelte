<script lang="ts">
	import { Separator } from '$lib/shared/components/ui/separator/index.js';

	import Example from '../example.svelte';
</script>

<Example title="Vertical">
	<div class="style-lyra:text-xs/relaxed flex h-5 items-center gap-4 text-sm">
		<div>Blog</div>
		<Separator orientation="vertical" />
		<div>Docs</div>
		<Separator orientation="vertical" />
		<div>Source</div>
	</div>
</Example>
