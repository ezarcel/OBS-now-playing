<script lang="ts">
  export let settings: IconDefinition = undefined;

  export let fixedWidth: boolean = false;
  export let margin: boolean = false;
  export let name = "poo";
  export let size: IconSize = "";
  export let style: IconStyle = "duotone";
  export let swapOpacity: boolean = false;
</script>

{#if settings}
  <i
    class={[
      `fa-${settings.style || "duotone"}`,
      `fa-${settings.name}`,
      `fa-${settings.size}`
    ].join(" ")}
    class:fa-swap-opacity={settings.swapOpacity}
    class:fa-fw={settings.fixedWidth}
    class:margin
  />
{:else}
  <i
    class={[`fa-${style}`, `fa-${name}`, size ? `fa-${size}` : ""].join(" ")}
    class:fa-swap-opacity={swapOpacity}
    class:fa-fw={fixedWidth}
    class:margin
  />
{/if}

<style>
  .margin {
    margin-right: 0.3em;
  }
</style>
