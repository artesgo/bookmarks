<script lang="ts">
	import { match } from './bookmarks';
	import { onDestroy, onMount } from 'svelte';
	import Bookmark from './lib/Bookmark.svelte';
	import { onRemove } from './onRemove';
	let bookmarks = [];
	let isPopup = false;
	let darkMode = false;
	let saveSearches = false;

	onMount(() => {
		updateNodes();
		chrome.bookmarks.onRemoved.addListener((removed) => {
			bookmarks = onRemove(removed, bookmarks);
		});
		// chrome.bookmarks.onChanged.addListener(() => updateNodes);
		document.getElementById('search').focus();
		chrome.storage.sync.get('darkMode', (mode) => {
			darkMode = mode.darkMode;
		});
		chrome.storage.sync.get('search', (search) => {
			if (search.search) {
				$match = search.search;
			}
		});
		isPopup = location.hash === '#popup';
	});

	function updateNodes() {
		chrome.bookmarks.getTree().then((bmTree) => {
			bmTree.forEach((subtree) => {
				let [bookmarkFolder, otherFolder, mobileFolder] = subtree.children;
				bookmarks = bookmarkFolder.children;
			});
		});
	}

	onDestroy(() => {
		chrome.bookmarks.onRemoved.removeListener(onRemove);
	});

	function toggleDarkMode() {
		darkMode = !darkMode;
		chrome.storage.sync.set({ darkMode: darkMode });
	}

	function saveSearch() {
		chrome.storage.sync.set({ search: $match });
	}

	function clearSearch() {
		$match = '';
	}
</script>

<main class:popup={isPopup} class:dark={darkMode} class:light={!darkMode}>
	<div class="container">
		<h1 class="sr-only">Artesgo Bookmarks</h1>
		<div class="controls">
			<button on:click={toggleDarkMode}>
				{#if darkMode}
					<div class="sr-only">Show Light Mode</div>
					<img src="./icons/sun.svg" role="presentation" alt="" />
				{:else}
					<div class="sr-only">Show Dark Mode</div>
					<img src="./icons/moon.svg" role="presentation" alt="" />
				{/if}
			</button>
			<label for="search" class="sr-only">Search</label>
			<input
				id="search"
				type="text"
				autocomplete="off"
				placeholder="artesgo bookmarks"
				bind:value={$match}
				on:change={saveSearch}
			/>
			<button on:click={clearSearch}>Clear Search</button>
		</div>
		{#each bookmarks as bookmarkNode (bookmarkNode['id'])}
			<Bookmark {bookmarkNode} />
		{/each}
	</div>
	<style>
		button img {
			width: 32px;
			height: 32px;
		}

		.controls {
			display: flex;
			align-items: center;
		}
	</style>
</main>

<style global>
	@font-face {
		font-family: 'Quicksand';
		src: local('Quicksand'), url('/font/static/Quicksand-Regular.ttf');
	}
	@font-face {
		font-family: 'QuicksandBold';
		src: local('QuicksandBold'), url('/font/static/Quicksand-Bold.ttf');
	}

	body {
		padding: 0;
		margin: 0;
	}

	main {
		font-family: 'Quicksand';
		font-weight: 700;
		min-height: 100vh;
	}

	.container {
		max-width: 750px;
		margin: 0 auto;
		padding: 1rem;
	}

	main.light {
		color: #1e1e24;
		background: #fcfcfc;
		transition: 300ms;
	}

	main.dark {
		color: #fcfcfc;
		background: #1e1e24;
		transition: 300ms;
	}

	main.popup {
		width: 420px;
	}

	.sr-only {
		clip: rect(0 0 0 0);
		clip-path: inset(50%);
		height: 1px;
		overflow: hidden;
		position: absolute;
		white-space: nowrap;
		width: 1px;
	}

	::-webkit-scrollbar {
		width: 4px;
	}

	::-webkit-scrollbar-thumb {
		background: #2e86ab;
	}

	button {
		flex-grow: 0;
		background: none;
		border: 1px solid transparent;
		color: inherit;
		border-radius: 50%;
	}

	button,
	a,
	input {
		outline: none;
	}

	input:focus,
	input:hover,
	button.icon:focus,
	button.icon:hover {
		border: 2px solid #ff3e00;
		transition: 300ms;
	}

	button.icon:focus,
	button.icon:hover {
		border-radius: 50%;
	}
</style>
