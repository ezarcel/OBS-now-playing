<script lang="ts">
  import Icon from "./Icon.svelte";

  export let accent: boolean = true;
  export let disabled: boolean = false;
  export let hideLabel: boolean = false;
  export let icon: IconDefinition | null = {
    name: "paper-plane",
    style: "duotone"
  };
  export let link: string = "#";
  export let title: string = "";
  export let wrapText: boolean = true;

  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher<{ click: undefined }>();
</script>

<a
  class:accent
  class:wrap-text={wrapText}
  {disabled}
  href={link || "#"}
  {title}
  on:click={() => dispatch("click")}
>
  {#if icon}<Icon settings={icon} margin={$$slots.default && !hideLabel} />{/if}
  {#if !hideLabel}<slot />{/if}
</a>

<style lang="scss">
  a {
    border: 1px solid;
    border-radius: 7.5px;
    display: flex;
    font-size: inherit;
    cursor: pointer;
    padding: 10px 15px;
    position: relative;
    align-items: center;
    justify-content: center;
    min-height: 43.6px;

    &,
    &:visited,
    :global(*),
    &:visited :global(*) {
      text-decoration: none;
    }

    &:not(.wrap-text) {
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    &.accent {
      background-color: var(--accent);
      border-color: var(--accent);

      &,
      &:visited,
      :global(*),
      &:visited :global(*) {
        color: white;
      }
    }

    &:not(.accent) {
      background-color: var(--bg);
      border-color: var(--bg-alt-alpha50);

      &,
      &:visited,
      :global(*),
      &:visited :global(*) {
        color: var(--bg-alt);
      }
    }

    &::before {
      content: "";
      position: absolute;
      height: calc(100% + 2px);
      border-radius: 7.5px;
      top: -1px;
      left: -1px;
      opacity: 0;
      pointer-events: none;
      transition: opacity 250ms;
      width: calc(100% + 2px);
      z-index: 1;
      background-color: var(--bg-alt);

      @supports (backdrop-filter: invert(1)) or
        (-webkit-backdrop-filter: invert(1)) {
        backdrop-filter: invert(1);
        -webkit-backdrop-filter: invert(1);
        background-color: transparent;
      }
    }

    @media screen and (hover: hover) {
      &:is(:hover, :focus-visible)::before {
        opacity: 0.1;
      }
    }

    &:active::before {
      opacity: 0.2;
    }
  }
</style>
