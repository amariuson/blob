<script lang="ts">
	import ExampleWrapper from '../example-wrapper.svelte';
	import ItemAsChild from './item-as-child.svelte';
	import ItemDefaultVariant from './item-default-variant.svelte';
	import ItemExtraSmallSize from './item-extra-small-size.svelte';
	import ItemFooter from './item-footer.svelte';
	import ItemGroup from './item-group.svelte';
	import ItemHeader from './item-header.svelte';
	import ItemHeaderAndFooter from './item-header-and-footer.svelte';
	import ItemMutedExtraSmall from './item-muted-extra-small.svelte';
	import ItemMutedGroup from './item-muted-group.svelte';
	import ItemMutedImage from './item-muted-image.svelte';
	import ItemMutedLink from './item-muted-link.svelte';
	import ItemMutedSmall from './item-muted-small.svelte';
	import ItemMutedVariant from './item-muted-variant.svelte';
	import ItemOutlineExtraSmall from './item-outline-extra-small.svelte';
	import ItemOutlineGroup from './item-outline-group.svelte';
	import ItemOutlineImage from './item-outline-image.svelte';
	import ItemOutlineImageExtraSmall from './item-outline-image-extra-small.svelte';
	import ItemOutlineImageSmall from './item-outline-image-small.svelte';
	import ItemOutlineLink from './item-outline-link.svelte';
	import ItemOutlineSmall from './item-outline-small.svelte';
	import ItemOutlineVariant from './item-outline-variant.svelte';
	import ItemSeparator from './item-separator.svelte';
	import ItemSmallSize from './item-small-size.svelte';
	import ItemWithImage from './item-with-image.svelte';
</script>

<ExampleWrapper>
	<ItemDefaultVariant />
	<ItemOutlineVariant />
	<ItemMutedVariant />
	<ItemSmallSize />
	<ItemOutlineSmall />
	<ItemMutedSmall />
	<ItemExtraSmallSize />
	<ItemOutlineExtraSmall />
	<ItemMutedExtraSmall />
	<ItemAsChild />
	<ItemOutlineLink />
	<ItemMutedLink />
	<ItemGroup />
	<ItemOutlineGroup />
	<ItemMutedGroup />
	<ItemSeparator />
	<ItemHeader />
	<ItemFooter />
	<ItemHeaderAndFooter />
	<ItemWithImage />
	<ItemOutlineImage />
	<ItemOutlineImageSmall />
	<ItemOutlineImageExtraSmall />
	<ItemMutedImage />
</ExampleWrapper>
