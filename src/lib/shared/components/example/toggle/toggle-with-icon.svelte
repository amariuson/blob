<script lang="ts">
	import { Toggle } from '$lib/shared/components/ui/toggle/index.js';

	import BookmarkIcon from '@lucide/svelte/icons/bookmark';

	import Example from '../example.svelte';
</script>

<Example title="With Icon">
	<div class="flex flex-wrap items-center gap-2">
		<Toggle aria-label="Toggle bookmark" pressed>
			<BookmarkIcon class="group-data-[state=on]/toggle:fill-accent-foreground" />
		</Toggle>
		<Toggle variant="outline" aria-label="Toggle bookmark outline">
			<BookmarkIcon class="group-data-[state=on]/toggle:fill-accent-foreground" />
			Bookmark
		</Toggle>
	</div>
</Example>
