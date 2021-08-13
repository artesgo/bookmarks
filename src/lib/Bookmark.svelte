<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { slide } from 'svelte/transition';

	import BookmarkSvg from '../assets/bookmark.svelte';
	import EditSvg from '../assets/edit-alt.svelte';
	import DeleteSvg from '../assets/delete.svelte';
	import CheckSvg from '../assets/check.svelte';

	import { onRemove } from '../onRemove';
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
		setTimeout(() => {
			if (edit) {
				document.getElementById(bookmarkNode.id).focus();
			} else {
				document.getElementById(bookmarkNode.id + '-edit').focus();
			}
		}, 0);
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

	function closeTab() {
		// close tab on open link
		window.close();
	}
</script>

{#if bookmarkNode.children}
	{#if hasChildShown}
		<h2><BookmarkSvg /><span>{bookmarkNode.title}</span></h2>
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
	<div class="flex" transition:slide>
		{#if edit}
			<!-- content here -->
			<label for={bookmarkNode.id} />
			<input id={bookmarkNode.id} type="text" bind:value={bookmarkNode.title} />
			<button class="icon" on:click={saveNode}>
				<div class="sr-only">Save</div>
				<CheckSvg />
			</button>
			<button class="icon" on:click={deleteNode}>
				<div class="sr-only">Delete</div>
				<DeleteSvg />
			</button>
		{:else}
			<a href={bookmarkNode.url} target="_blank" title={bookmarkNode.url} on:click={closeTab}>
				<!-- not available from chrome.bookmarks -->
				<!-- <img src={bookmarkNode.favIconUrl} alt="" role="presentation" /> -->
				{bookmarkNode.title}
			</a>
			<button id={`${bookmarkNode.id}-edit`} class="icon" on:click={editNode}>
				<div class="sr-only">Edit</div>
				<EditSvg />
			</button>
		{/if}
	</div>
{/if}

<style>
	h2 span {
		margin-left: 0.5rem;
	}

	.grid-item,
	a {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		display: block;
		text-decoration: none;
		color: inherit;
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
		border-left: 1px solid #8f8c8d;
	}

	.flex {
		display: flex;
	}

	.flex input,
	.flex a {
		flex-grow: 1;
	}

	button.icon {
		width: 28px;
		height: 28px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
