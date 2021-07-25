<script lang="ts">
	import { match } from './../bookmarks';
	import { onMount } from 'svelte';
	export let bookmarkNode;

	onMount(() => {});
</script>

{#if bookmarkNode.children}
	<h2>{bookmarkNode.title}</h2>
	<hr />
	{#each bookmarkNode.children as childNode (childNode['id'])}
		<svelte:self bookmarkNode={childNode} />
	{/each}
{:else}
	<div>
		{#if $match === '' || bookmarkNode.title.toLowerCase().indexOf($match) > -1}
			<a href={bookmarkNode.url} target="_blank" title={bookmarkNode.url}>
				<!-- not available from chrome.bookmarks -->
				<!-- <img src={bookmarkNode.favIconUrl} alt="" role="presentation" /> -->
				{bookmarkNode.title}
			</a>
		{/if}
	</div>
{/if}

<style>
	a {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		display: block;
		margin-bottom: 0.25rem;
		text-decoration: none;
		color: black;
	}
</style>
