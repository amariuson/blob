<script lang="ts">
	import { resolve } from '$app/paths';
	import { PUBLIC_STATIC_URL } from '$env/static/public';
	import * as Sidebar from '$lib/shared/components/ui/sidebar/index.js';
</script>

<Sidebar.MenuButton
	class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
>
	{#snippet child({ props })}
		<a href={resolve('/')} {...props}>
			<img src={`${PUBLIC_STATIC_URL}/logo.png`} alt="Bits Logo" class="size-4" />
			<div class="truncate text-sm font-medium">
				Blob
				<span class="-ml-0.75 text-xs text-sidebar-foreground/25">.is</span>
			</div>
		</a>
	{/snippet}
</Sidebar.MenuButton>
