<script lang="ts">
	import ExampleWrapper from '../example-wrapper.svelte';
	import DialogChatSettings from './dialog-chat-settings.svelte';
	import DialogNoCloseButton from './dialog-no-close-button.svelte';
	import DialogScrollableContent from './dialog-scrollable-content.svelte';
	import DialogWithForm from './dialog-with-form.svelte';
	import DialogWithStickyFooter from './dialog-with-sticky-footer.svelte';
</script>

<ExampleWrapper>
	<DialogWithForm />
	<DialogScrollableContent />
	<DialogWithStickyFooter />
	<DialogNoCloseButton />
	<DialogChatSettings />
</ExampleWrapper>
