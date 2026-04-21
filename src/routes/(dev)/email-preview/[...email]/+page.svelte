<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="flex h-svh flex-col">
	<header class="flex shrink-0 flex-col gap-2 border-b p-4">
		<div class="flex items-baseline justify-between gap-4">
			<h1 class="text-sm font-semibold">Subject: {data.subject}</h1>
			<span class="text-xs text-muted-foreground">{data.slug}</span>
		</div>
		<nav class="flex flex-wrap gap-2">
			{#each data.slugs as slug (slug)}
				<a
					href="/email-preview/{slug}"
					class="rounded border px-2 py-1 text-xs hover:bg-muted"
					class:bg-muted={slug === data.slug}
				>
					{slug}
				</a>
			{/each}
		</nav>
	</header>
	<iframe title="Email preview: {data.slug}" srcdoc={data.html} class="flex-1 border-0"></iframe>
</div>
