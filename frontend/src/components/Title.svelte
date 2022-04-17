<script lang="ts">
  import Icon from "./Icon.svelte";

  export let changePageTitle: boolean = true;
  export let icon: IconDefinition;
  export let margin: boolean = true;
  export let text: string = "";
  export let size: number = 0;

  $: if (changePageTitle) document.title = `${text} - Kuzi`;
</script>

<h1
  class={$$props.class}
  class:margin
  style={`--size: ${size}; ${$$props.style}`}
>
  <Icon settings={icon} margin /><span>{text}</span>
</h1>

<style lang="scss">
  h1 {
    color: var(--accent);
    font-weight: normal;
    font-size: calc(2rem - (var(--size, 0) * 0.5rem));
    width: max-content;
    max-width: 100%;
    display: flex;
    flex-direction: row;

    span {
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &.margin {
      margin: 0 0 22.5px 0;
    }

    :global(i) {
      line-height: 1.45;
    }
  }
</style>
