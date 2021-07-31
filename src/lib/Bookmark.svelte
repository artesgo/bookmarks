<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { match } from './../bookmarks';
	export let bookmarkNode;
	export let parentTitle = '';
	let hasChildShown = true;
	let unsub;

	function isShown() {
		let isMatchTitle = bookmarkNode.title?.toLowerCase().indexOf($match) > -1;
		let isMatchUrl = bookmarkNode.url?.toLowerCase().indexOf($match) > -1;
		let isMatchParent = parentTitle?.toLowerCase().indexOf($match) > -1;
		bookmarkNode.isShown = isMatchTitle || isMatchUrl || isMatchParent;
		return isMatchTitle || isMatchUrl || isMatchParent;
	}

	function isChildShown() {
		if (bookmarkNode.children && $match !== '') {
			return bookmarkNode.children.findIndex((node) => node.isShown) > -1;
		}
		return true;
	}

	onMount(() => {
		unsub = match.subscribe(() => {
			setTimeout(() => {
				hasChildShown = isChildShown();
			}, 0);
		});
	});

	onDestroy(unsub);
</script>

{#if bookmarkNode.children}
	{#if hasChildShown}
		<h2>{bookmarkNode.title}</h2>
	{/if}
	{#each bookmarkNode.children as childNode (childNode['id'])}
		<div class="grid">
			<div class="grid-spacer" />
			<div class="grid-item">
				<svelte:self bind:bookmarkNode={childNode} parentTitle={bookmarkNode.title} />
			</div>
		</div>
	{/each}
{:else if $match === '' || isShown()}
	<a href={bookmarkNode.url} target="_blank" title={bookmarkNode.url}>
		<!-- not available from chrome.bookmarks -->
		<!-- <img src={bookmarkNode.favIconUrl} alt="" role="presentation" /> -->
		{bookmarkNode.title}
	</a>
{/if}

<style>
	.grid-item,
	a {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		display: block;
		text-decoration: none;
		color: black;
	}

	.grid {
		display: grid;
		grid-template-columns: 1rem 1fr;
	}

	.grid-spacer {
		border-left: 1px solid black;
	}
</style>
