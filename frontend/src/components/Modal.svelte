<script lang="ts">
  import Icon from "./Icon.svelte";

  import { createEventDispatcher } from "svelte";

  export let closable: boolean = true;
  export let visible: boolean = false;

  const dispatch = createEventDispatcher<{ show: void; hide: void }>();

  let delayedVisible = false;

  function keyHandler(e: KeyboardEvent) {
    if (e.key === "Escape" && closable) visible = false;
  }

  function update() {
    if (closable) {
      window[visible ? "addEventListener" : "removeEventListener"](
        "keydown",
        keyHandler
      );
      setTimeout(() => dispatch(visible ? "show" : "hide"), visible ? 0 : 250);
    }
  }
  $: update(), visible;

  $: setTimeout(() => (delayedVisible = visible), 250);
</script>

<div
  class="modal-component {$$props.class || ''}"
  class:visible
  style={$$props.style}
>
  {#if visible || delayedVisible}
    <div
      class="close-btn"
      class:visible={closable}
      on:click={() => closable && (visible = false)}
    >
      <Icon name="close" style="solid" />
    </div>
    <div class="modal-box">
      <slot />
    </div>
  {/if}
</div>

<style lang="scss">
  .modal-component {
    position: fixed;
    inset: 0;
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: hsla(0, 0%, 0%, 0.9);
    transition: opacity 250ms;

    &:not(.visible) {
      opacity: 0;
      pointer-events: none;
    }

    @supports (backdrop-filter: blur()) or (-webkit-backdrop-filter: blur()) {
      background-color: hsla(0, 0%, 0%, 0.75);
      backdrop-filter: blur(7.5px);
      -webkit-backdrop-filter: blur(7.5px);
    }

    .modal-box {
      background-color: var(--bg);
      border-radius: 20px;
      padding: 25px;
      min-width: calc((1 / 3) * 100%);
      width: min-content;
      max-width: calc(100% - 40px);
      max-height: calc(100% - 65px * 2);
      overflow: auto;
      display: flex;
      flex-direction: column;
    }

    .close-btn {
      font-size: 35px;
      position: absolute;
      top: 20px;
      right: 20px;
      cursor: pointer;
      color: #fff;

      &:not(.visible) {
        display: none;
      }

      &,
      :global(*) {
        display: block;
        line-height: 25px;
        height: 25px;
        width: 25px;
      }

      @media screen and (hover: hover) {
        &::after {
          content: "ESC";
          font-size: 14px;
          pointer-events: none;
          opacity: 0;
          position: relative;
          top: -5px;
          left: -2px;
          transition: opacity 100ms;
        }
        &:hover::after {
          opacity: 1;
        }
      }
    }
  }
</style>
