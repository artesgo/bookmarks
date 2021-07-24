<script lang="ts">
  import { onMount } from "svelte";
  export let bookmarkNode;

  onMount(() => {

  });
</script>

{#if bookmarkNode.children}
  <h2>{bookmarkNode.title}</h2>
  <hr />
  {#each bookmarkNode.children as childNode}
    <svelte:self bookmarkNode={childNode} />
  {/each}
{:else}
  <div>
    <a href={bookmarkNode.url} target="_blank">{bookmarkNode.title}</a>
  </div>
{/if}