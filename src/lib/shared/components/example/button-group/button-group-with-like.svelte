<script lang="ts">
	import { Button } from '$lib/shared/components/ui/button/index.js';
	import { ButtonGroup } from '$lib/shared/components/ui/button-group/index.js';

	import HeartIcon from '@lucide/svelte/icons/heart';

	import Example from '../example.svelte';
</script>

<Example title="With Like">
	<ButtonGroup>
		<Button variant="outline">
			<HeartIcon data-icon="inline-start" />
			Like
		</Button>
		<Button variant="outline" size="icon" class="w-12">1.2K</Button>
	</ButtonGroup>
</Example>
