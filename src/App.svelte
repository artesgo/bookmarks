<script lang="ts">
	import { match } from './bookmarks';
	import { onMount } from 'svelte';
	import Bookmark from './lib/Bookmark.svelte';
	let bookmarks: any = [];

	onMount(() => {
		chrome.bookmarks.getTree().then((bmTree) => {
			bmTree.forEach((subtree) => {
				let [bookmarkFolder, otherFolder, mobileFolder] = subtree.children;
				bookmarks = bookmarkFolder.children;
			});
		});
	});
</script>

<main>
	<h1 class="sr-only">Artesgo Bookmarks</h1>
	<input type="text" placeholder="artesgo bookmarks" bind:value={$match} />
	{#each bookmarks as bookmarkNode}
		<Bookmark {bookmarkNode} />
	{/each}
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

	main {
		font-family: 'Quicksand';
		font-weight: 700;
		padding: 1rem;
		margin: 0 auto;
		width: 450px;
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
</style>
