<script lang="ts">
	import { page } from '$app/state';

	import { EmailPreview } from 'better-svelte-email/preview';
</script>

<EmailPreview {page} />
