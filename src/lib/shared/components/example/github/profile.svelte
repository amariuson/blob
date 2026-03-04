<script lang="ts">
	import { Button } from '$lib/shared/components/ui/button/index.js';
	import * as Card from '$lib/shared/components/ui/card/index.js';
	import * as Field from '$lib/shared/components/ui/field/index.js';
	import { Input } from '$lib/shared/components/ui/input/index.js';
	import * as NativeSelect from '$lib/shared/components/ui/native-select/index.js';
	import { Textarea } from '$lib/shared/components/ui/textarea/index.js';

	import Example from '../example.svelte';
</script>

<Example title="Profile" class="items-center justify-center">
	<Card.Root class="mx-auto w-full max-w-md">
		<Card.Header>
			<Card.Title>Profile</Card.Title>
			<Card.Description>Manage your profile information.</Card.Description>
		</Card.Header>
		<Card.Content>
			<form id="profile">
				<Field.Group>
					<Field.Field>
						<Field.Label for="name">Name</Field.Label>
						<Input id="name" placeholder="shadcn" />
						<Field.Description>
							Your name may appear around GitHub where you contribute or are mentioned. You can
							remove it at any time.
						</Field.Description>
					</Field.Field>
					<Field.Field>
						<Field.Label for="email">Public Email</Field.Label>
						<NativeSelect.Root id="email">
							<NativeSelect.Option value="m@shadcn.com">m@shadcn.com</NativeSelect.Option>
							<NativeSelect.Option value="m@gmail.com">m@gmail.com</NativeSelect.Option>
						</NativeSelect.Root>
						<Field.Description>
							You can manage verified email addresses in your
							<a href="#email-settings">email settings</a>.
						</Field.Description>
					</Field.Field>
					<Field.Field>
						<Field.Label for="bio">Bio</Field.Label>
						<Textarea id="bio" placeholder="Tell us a little bit about yourself" />
						<Field.Description>
							You can <span>@mention</span> other users and organizations to link to them.
						</Field.Description>
					</Field.Field>
				</Field.Group>
			</form>
		</Card.Content>
		<Card.Footer>
			<Button form="profile">Save Profile</Button>
		</Card.Footer>
	</Card.Root>
</Example>
