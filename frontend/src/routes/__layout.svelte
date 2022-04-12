<script>
  import { init } from "../stores";

  import "../styles/global.scss";

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
{/if}
