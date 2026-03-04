<script lang="ts">
	import * as Breadcrumb from '$lib/shared/components/ui/breadcrumb/index.js';
	import { Button } from '$lib/shared/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/shared/components/ui/dropdown-menu/index.js';

	import Example from '../example.svelte';
</script>

<Example title="With Dropdown" class="items-center justify-center">
	<Breadcrumb.Root>
		<Breadcrumb.List>
			<Breadcrumb.Item>
				<Breadcrumb.Link href="#/">Home</Breadcrumb.Link>
			</Breadcrumb.Item>
			<Breadcrumb.Separator />
			<Breadcrumb.Item>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						{#snippet child({ props })}
							<Button size="icon-sm" variant="ghost" {...props}>
								<Breadcrumb.Ellipsis />
								<span class="sr-only">Toggle menu</span>
							</Button>
						{/snippet}
					</DropdownMenu.Trigger>
					<DropdownMenu.Content align="start">
						<DropdownMenu.Item>Documentation</DropdownMenu.Item>
						<DropdownMenu.Item>Themes</DropdownMenu.Item>
						<DropdownMenu.Item>GitHub</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</Breadcrumb.Item>
			<Breadcrumb.Separator />
			<Breadcrumb.Item>
				<Breadcrumb.Link href="#/">Components</Breadcrumb.Link>
			</Breadcrumb.Item>
			<Breadcrumb.Separator />
			<Breadcrumb.Item>
				<Breadcrumb.Page>Breadcrumb</Breadcrumb.Page>
			</Breadcrumb.Item>
		</Breadcrumb.List>
	</Breadcrumb.Root>
</Example>
