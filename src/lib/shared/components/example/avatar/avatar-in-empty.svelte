<script lang="ts">
	import * as Avatar from '$lib/shared/components/ui/avatar/index.js';
	import { Button } from '$lib/shared/components/ui/button/index.js';
	import * as Empty from '$lib/shared/components/ui/empty/index.js';

	import PlusIcon from '@lucide/svelte/icons/plus';

	import Example from '../example.svelte';
</script>

<Example title="In Empty">
	<Empty.Root class="w-full flex-none border">
		<Empty.Header>
			<Empty.Media>
				<Avatar.Group>
					<Avatar.Root size="lg">
						<Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" class="grayscale" />
						<Avatar.Fallback>CN</Avatar.Fallback>
					</Avatar.Root>
					<Avatar.Root size="lg">
						<Avatar.Image
							src="https://github.com/maxleiter.png"
							alt="@maxleiter"
							class="grayscale"
						/>
						<Avatar.Fallback>LR</Avatar.Fallback>
					</Avatar.Root>
					<Avatar.Root size="lg">
						<Avatar.Image
							src="https://github.com/evilrabbit.png"
							alt="@evilrabbit"
							class="grayscale"
						/>
						<Avatar.Fallback>ER</Avatar.Fallback>
					</Avatar.Root>
					<Avatar.GroupCount>
						<PlusIcon />
					</Avatar.GroupCount>
				</Avatar.Group>
			</Empty.Media>
			<Empty.Title>No Team Members</Empty.Title>
			<Empty.Description>Invite your team to collaborate on this project.</Empty.Description>
		</Empty.Header>
		<Empty.Content>
			<Button>
				<PlusIcon />
				Invite Members
			</Button>
		</Empty.Content>
	</Empty.Root>
</Example>
