<script lang="ts">
	import ExampleWrapper from '../example-wrapper.svelte';
	import CardDefault from './card-default.svelte';
	import CardFooterWithBorder from './card-footer-with-border.svelte';
	import CardFooterWithBorderSmall from './card-footer-with-border-small.svelte';
	import CardHeaderWithBorder from './card-header-with-border.svelte';
	import CardHeaderWithBorderSmall from './card-header-with-border-small.svelte';
	import CardLogin from './card-login.svelte';
	import CardMeetingNotes from './card-meeting-notes.svelte';
	import CardSmall from './card-small.svelte';
	import CardWithImage from './card-with-image.svelte';
	import CardWithImageSmall from './card-with-image-small.svelte';
</script>

<ExampleWrapper>
	<CardDefault />
	<CardSmall />
	<CardHeaderWithBorder />
	<CardFooterWithBorder />
	<CardHeaderWithBorderSmall />
	<CardFooterWithBorderSmall />
	<CardWithImage />
	<CardWithImageSmall />
	<CardLogin />
	<CardMeetingNotes />
</ExampleWrapper>
