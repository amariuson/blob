<script lang="ts">
	import ExampleWrapper from '../example-wrapper.svelte';
	import AvatarGroupExample from './avatar-group-example.svelte';
	import AvatarGroupWithCount from './avatar-group-with-count.svelte';
	import AvatarGroupWithIconCount from './avatar-group-with-icon-count.svelte';
	import AvatarInEmpty from './avatar-in-empty.svelte';
	import AvatarSizes from './avatar-sizes.svelte';
	import AvatarWithBadge from './avatar-with-badge.svelte';
	import AvatarWithBadgeIcon from './avatar-with-badge-icon.svelte';
</script>

<ExampleWrapper>
	<AvatarSizes />
	<AvatarWithBadge />
	<AvatarWithBadgeIcon />
	<AvatarGroupExample />
	<AvatarGroupWithCount />
	<AvatarGroupWithIconCount />
	<AvatarInEmpty />
</ExampleWrapper>
