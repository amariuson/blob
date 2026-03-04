<script lang="ts">
	import { Toaster } from '$lib/shared/components/ui/sonner';

	import { ModeWatcher } from 'mode-watcher';

	import './layout.css';

	let { children } = $props();
</script>

<ModeWatcher />
<Toaster />
{@render children()}
