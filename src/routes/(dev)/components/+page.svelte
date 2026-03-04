<script>
	import { examples } from '$lib/shared/components/example';
</script>

{#each examples.filter(({ name }) => !name.startsWith('sidebar')) as example (example.name)}
	{@const ComponentPromise = import(
		`$lib/shared/components/example/${example.name}/${example.name}.svelte`
	)}
	{#await ComponentPromise then { default: Component }}
		<Component />
	{/await}
{/each}
