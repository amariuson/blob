<script>
	import { PUBLIC_STATIC_URL } from '$env/static/public';
	import Button from '$lib/shared/components/ui/button/button.svelte';
	import { SignInWithEmailForm, SignInWithGoogleForm } from './forms';
</script>

<section class="flex min-h-screen px-4 py-16 md:py-32">
	<div class="m-auto h-fit w-full max-w-92">
		<div class="p-6">
			<div>
				<img src={`${PUBLIC_STATIC_URL}/logo.png`} alt="Blob Logo" class="size-8" />
				<h1 class="mt-4 mb-1 text-xl font-semibold">Sign in to Blob</h1>
				<p>Welcome back!</p>
			</div>

			<SignInWithGoogleForm class="mt-6" />

			<div class="my-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
				<hr class="border-dashed" />
				<span class="text-xs text-muted-foreground">Or continue With</span>
				<hr class="border-dashed" />
			</div>

			<SignInWithEmailForm class="space-y-6" />
		</div>

		<p class="text-center text-sm text-accent-foreground">
			Don't have an account ?
			<Button variant="link" class="px-2" href="/sign-up">Create account</Button>
		</p>
	</div>
</section>
