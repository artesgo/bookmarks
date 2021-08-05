<script lang="ts">
	import { onRemove } from '../onRemove';

	import { onDestroy, onMount } from 'svelte';
	import { match } from '../bookmarks';
	export let bookmarkNode;
	export let parentTitle = '';
	let hasChildShown = true;
	let unsub;
	let edit = false;

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

	function deleteNode() {
		chrome.bookmarks.remove(bookmarkNode.id);
	}

	function editNode() {
		edit = !edit;
	}

	function saveNode() {
		chrome.bookmarks
			.update(bookmarkNode.id, {
				title: bookmarkNode.title,
			})
			.then();
		editNode();
	}

	onMount(() => {
		unsub = match.subscribe(() => {
			setTimeout(() => {
				hasChildShown = isChildShown();
			}, 0);
		});
		if (bookmarkNode.children) {
			chrome.bookmarks.onRemoved.addListener((removed) => {
				bookmarkNode.children = onRemove(removed, bookmarkNode.children);
			});
		}
	});

	onDestroy(() => {
		unsub();
		chrome.bookmarks.onRemoved.removeListener(onRemove);
	});
</script>

{#if bookmarkNode.children}
	{#if hasChildShown}
		<h2><img src="./icons/bookmark.svg" role="presentation" alt="" /> {bookmarkNode.title}</h2>
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
	<div class="flex">
		{#if edit}
			<!-- content here -->
			<input type="text" bind:value={bookmarkNode.title} />
			<button on:click={saveNode}>
				<div class="sr-only">Save</div>
				<img src="./icons/check.svg" alt="save icon" />
			</button>
			<button on:click={deleteNode}>
				<div class="sr-only">Delete</div>
				<img src="./icons/delete.svg" alt="delete icon" />
			</button>
		{:else}
			<a href={bookmarkNode.url} target="_blank" title={bookmarkNode.url}>
				<!-- not available from chrome.bookmarks -->
				<!-- <img src={bookmarkNode.favIconUrl} alt="" role="presentation" /> -->
				{bookmarkNode.title}
			</a>
			<button on:click={editNode}>
				<div class="sr-only">Edit</div>
				<img src="./icons/edit-alt.svg" alt="edit icon" />
			</button>
		{/if}
	</div>
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

	a:focus,
	a:hover {
		color: #ff3e00;
	}

	.grid {
		display: grid;
		grid-template-columns: 1rem 1fr;
	}

	.grid-spacer {
		border-left: 1px solid black;
	}

	.flex {
		display: flex;
	}

	.flex input,
	.flex a {
		flex-grow: 1;
	}

	.flex button {
		flex-grow: 0;
		background: none;
		border: none;
	}

	h2 img,
	.flex button img {
		width: 16px;
		height: 16px;
	}
</style>
