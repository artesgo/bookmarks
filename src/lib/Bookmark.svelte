<script lang="ts">
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
		<a href={bookmarkNode.url} target="_blank" title={bookmarkNode.url}>
			<!-- not available from chrome.bookmarks -->
			<!-- <img src={bookmarkNode.favIconUrl} alt="" role="presentation" /> -->
			{bookmarkNode.title}
		</a>
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
