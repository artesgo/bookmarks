<script lang="ts">
  import { onMount } from "svelte";
  import Bookmark from "./lib/Bookmark.svelte";
  let bookmarks: any = [];

  onMount(() => {
    chrome.bookmarks.getTree().then(bmTree => {
      bmTree.forEach(subtree => {
        // console.log(subtree.children);
        let [bookmarkFolder, otherFolder, mobileFolder] = subtree.children;
        bookmarks = bookmarkFolder.children;
      })
    })
  });
</script>

<main>
  <h1 class="sr-only">Artesgo Bookmarks</h1>
  <input type="text" placeholder='artesgo bookmarks' />
  {#each bookmarks as bookmarkNode}
    <div>
      {#if bookmarkNode && bookmarkNode['title']}
        <Bookmark {bookmarkNode} />
      {/if}
    </div>
  {/each}
</main>

<style global>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  main {
    padding: 1em;
    margin: 0 auto;
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
