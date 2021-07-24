<script lang="ts">
  import { onMount } from "svelte";
  export let bookmarkNode;

  onMount(() => {

  });
</script>

{#if bookmarkNode.children}
  {#each bookmarkNode.children as childNode}
    <svelte:self bookmarkNode={childNode} />
  {/each}
{:else}
  <div>
    {bookmarkNode.title}
  </div>
{/if}