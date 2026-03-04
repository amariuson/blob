<script lang="ts">
	import * as Button from '$lib/shared/components/ui/button/index.js';
	import * as Card from '$lib/shared/components/ui/card/index.js';
	import * as Field from '$lib/shared/components/ui/field/index.js';
	import * as Input from '$lib/shared/components/ui/input/index.js';

	import Example from '../example.svelte';
</script>

<Example title="Login">
	<Card.Root class="mx-auto w-full max-w-sm">
		<Card.Header>
			<Card.Title>Login to your account</Card.Title>
			<Card.Description>Enter your email below to login to your account</Card.Description>
		</Card.Header>
		<Card.Content>
			<form>
				<Field.Group>
					<Field.Field>
						<Field.Label for="email">Email</Field.Label>
						<Input.Root id="email" type="email" placeholder="m@example.com" required />
					</Field.Field>
					<Field.Field>
						<div class="flex items-center">
							<Field.Label for="password">Password</Field.Label>
							<a href="#/" class="ml-auto inline-block underline-offset-4 hover:underline">
								Forgot your password?
							</a>
						</div>
						<Input.Root id="password" type="password" required />
					</Field.Field>
				</Field.Group>
			</form>
		</Card.Content>
		<Card.Footer class="flex-col gap-2">
			<Button.Root type="submit" class="w-full">Login</Button.Root>
			<Button.Root variant="outline" class="w-full">Login with Google</Button.Root>
			<div class="mt-4 text-center">
				Don't have an account?
				<a href="#/" class="underline underline-offset-4"> Sign up </a>
			</div>
		</Card.Footer>
	</Card.Root>
</Example>
