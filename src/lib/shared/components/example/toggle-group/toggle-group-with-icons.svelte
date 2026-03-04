<script lang="ts">
	import * as ToggleGroup from '$lib/shared/components/ui/toggle-group/index.js';

	import BookmarkIcon from '@lucide/svelte/icons/bookmark';
	import HeartIcon from '@lucide/svelte/icons/heart';
	import StarIcon from '@lucide/svelte/icons/star';

	import Example from '../example.svelte';
</script>

<Example title="With Icons">
	<ToggleGroup.Root type="multiple" variant="outline" spacing={2} size="sm">
		<ToggleGroup.Item
			value="star"
			aria-label="Toggle star"
			class="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-foreground data-[state=on]:*:[svg]:stroke-foreground"
		>
			<StarIcon />
			Star
		</ToggleGroup.Item>
		<ToggleGroup.Item
			value="heart"
			aria-label="Toggle heart"
			class="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-foreground data-[state=on]:*:[svg]:stroke-foreground"
		>
			<HeartIcon />
			Heart
		</ToggleGroup.Item>
		<ToggleGroup.Item
			value="bookmark"
			aria-label="Toggle bookmark"
			class="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-foreground data-[state=on]:*:[svg]:stroke-foreground"
		>
			<BookmarkIcon />
			Bookmark
		</ToggleGroup.Item>
	</ToggleGroup.Root>
</Example>
