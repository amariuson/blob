<script lang="ts">
	import { Auth, Layout } from '$features/auth';
	import { Button } from '$lib/shared/components/ui/button';
</script>

<Layout heading="Create an account" subHeading="Get started in seconds">
	<Auth />
	{#snippet below()}
		<p class="text-center text-sm text-accent-foreground">
			Already have an account?
			<Button variant="link" class="px-2" size="lg" href="/sign-in">Sign in</Button>
		</p>
	{/snippet}
</Layout>
