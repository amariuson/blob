<script>
	import { Auth, Layout } from '$features/auth';
	import { Button } from '$lib/shared/components/ui/button';
</script>

<Layout heading="Welcome to Blob" subHeading="Choose how you'd like to get started">
	<Auth />
	{#snippet below()}
		<p class="text-center text-sm text-accent-foreground">
			Have an account ?
			<Button variant="link" class="px-2" href="/sign-in">Sign in</Button>
		</p>
	{/snippet}
</Layout>
