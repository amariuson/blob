<script lang="ts">
	import ExampleWrapper from '../example-wrapper.svelte';
	import AlertDialogBasic from './alert-dialog-basic.svelte';
	import AlertDialogDestructive from './alert-dialog-destructive.svelte';
	import AlertDialogInDialog from './alert-dialog-in-dialog.svelte';
	import AlertDialogSmall from './alert-dialog-small.svelte';
	import AlertDialogSmallWithMedia from './alert-dialog-small-with-media.svelte';
	import AlertDialogWithMedia from './alert-dialog-with-media.svelte';
</script>

<ExampleWrapper>
	<AlertDialogBasic />
	<AlertDialogSmall />
	<AlertDialogWithMedia />
	<AlertDialogSmallWithMedia />
	<AlertDialogDestructive />
	<AlertDialogInDialog />
</ExampleWrapper>
