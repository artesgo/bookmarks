<script lang="ts">
	import { match } from './../bookmarks';
	export let bookmarkNode;
	export let parentTitle = '';
	function isShown() {
		return matchTitleOrUrl();
	}

	function matchTitleOrUrl() {
		let isMatchTitle = bookmarkNode.title?.toLowerCase().indexOf($match) > -1;
		let isMatchUrl = bookmarkNode.url?.toLowerCase().indexOf($match) > -1;
		let isMatchParent = parentTitle?.toLowerCase().indexOf($match) > -1;
		return isMatchTitle || isMatchUrl || isMatchParent;
	}
</script>

{#if bookmarkNode.children}
	<h2>{bookmarkNode.title}</h2>
	<hr />
	{#each bookmarkNode.children as childNode (childNode['id'])}
		<svelte:self bookmarkNode={childNode} parentTitle={bookmarkNode.title} />
	{/each}
{:else if $match === '' || isShown()}
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
