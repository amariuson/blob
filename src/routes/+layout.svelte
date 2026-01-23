<script lang="ts">
	import './layout.css';
	import { Toaster } from '$lib/shared/components/ui/sonner';
	import { ModeWatcher } from 'mode-watcher';

	let { children } = $props();
</script>

<ModeWatcher />
<Toaster />
{@render children()}
