<script>
  import { init } from "../stores";

  import { page } from "$app/stores";
  import { onMount, tick } from "svelte";

  let mounted = false;

  onMount(async () => {
    if ($page.url.pathname.startsWith("/player/")) init();
    await tick();
    mounted = true;
  });
</script>

{#if mounted}
  <slot />

  {#if $page.url.pathname.startsWith("/player/")}
    <style lang="scss">
      @use "../styles/player.scss";
    </style>
  {:else}
    <style lang="scss">
      @use "../styles/global.scss";
    </style>
  {/if}
{/if}
