<script lang="ts">
	import { resolve } from '$app/paths';
	import * as Sidebar from '$lib/shared/components/ui/sidebar/index.js';
</script>

<Sidebar.MenuButton
	class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
>
	{#snippet child({ props })}
		<a href={resolve('/')} {...props}>
			<img src="https://static.blob.is/logo.png" alt="Bits Logo" class="size-4" />
			<div class="truncate text-sm font-medium">
				Blob
				<span class="-ml-0.75 text-xs text-sidebar-foreground/25">.is</span>
			</div>
		</a>
	{/snippet}
</Sidebar.MenuButton>
