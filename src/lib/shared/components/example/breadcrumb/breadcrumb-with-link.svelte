<script lang="ts">
	import * as Breadcrumb from '$lib/shared/components/ui/breadcrumb/index.js';

	import Example from '../example.svelte';
</script>

<Example title="With Link" class="items-center justify-center">
	<Breadcrumb.Root>
		<Breadcrumb.List>
			<Breadcrumb.Item>
				<Breadcrumb.Link>
					{#snippet child({ props })}
						<a href="#/" {...props}>Home</a>
					{/snippet}
				</Breadcrumb.Link>
			</Breadcrumb.Item>
			<Breadcrumb.Separator />
			<Breadcrumb.Item>
				<Breadcrumb.Ellipsis />
			</Breadcrumb.Item>
			<Breadcrumb.Separator />
			<Breadcrumb.Item>
				<Breadcrumb.Link>
					{#snippet child({ props })}
						<a href="#/" {...props}>Components</a>
					{/snippet}
				</Breadcrumb.Link>
			</Breadcrumb.Item>
			<Breadcrumb.Separator />
			<Breadcrumb.Item>
				<Breadcrumb.Page>Breadcrumb</Breadcrumb.Page>
			</Breadcrumb.Item>
		</Breadcrumb.List>
	</Breadcrumb.Root>
</Example>
