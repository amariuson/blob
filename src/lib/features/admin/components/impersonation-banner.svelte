<script lang="ts">
	import type { Snippet } from 'svelte';

	import { ElementSize } from 'runed';

	import { getImpersonationStatusQuery } from '../admin.remote';
	import StopImpersonationForm from './stop-impersonation-form.svelte';

	let { children }: { children?: Snippet } = $props();

	let bannerEl = $state<HTMLDivElement>();
	const bannerHeight = new ElementSize(() => bannerEl);

	const status = $derived(await getImpersonationStatusQuery());
</script>

{#if status?.isImpersonating}
	<div class="relative grid h-svh w-full grid-cols-1 grid-rows-1">
		<div
			class="col-start-1 row-start-1"
			style="background: repeating-linear-gradient(
        -45deg,
        #dc2626,
        #dc2626 10px,
        #d31716 10px,
        #d31716 20px
      );"
		></div>

		<!-- Spacer to push content below fixed banner -->
		<div
			class="group/banner col-start-1 row-start-1"
			style={`--banner-height: ${bannerHeight.height || 48}px;`}
			data-active="true"
		>
			{@render children?.()}
		</div>

		<div class="col-start-1 row-start-1">
			<div
				bind:this={bannerEl}
				class="z-10 flex items-center justify-center gap-4 px-4 py-2.5 text-white"
			>
				<span class="text-sm font-medium drop-shadow-sm">
					Viewing as <span class="font-bold">{status.viewingAs.name}</span>
					({status.viewingAs.email})
				</span>
				<StopImpersonationForm />
			</div>
		</div>
	</div>
{:else}
	{@render children?.()}
{/if}
