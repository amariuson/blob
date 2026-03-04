<script lang="ts">
	import * as Breadcrumb from '$lib/shared/components/ui/breadcrumb/index.js';

	import Example from '../example.svelte';
</script>

<Example title="Basic" class="items-center justify-center">
	<Breadcrumb.Root>
		<Breadcrumb.List>
			<Breadcrumb.Item>
				<Breadcrumb.Link href="#/">Home</Breadcrumb.Link>
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
