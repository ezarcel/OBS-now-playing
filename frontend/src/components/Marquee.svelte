<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  let animating: boolean;
  let animationDuration: number;

  let wrapper: HTMLDivElement;
  let main: HTMLDivElement;

  let intervalID: number;
  onMount(
    () =>
      (intervalID = window.setInterval(() => {
        if (main.offsetWidth > wrapper.offsetWidth) {
          animating = true;

          const x = main.offsetWidth + wrapper.offsetWidth;
          const SPEED = 100 / 3; // pixels/second
          // v = x / t
          animationDuration = x / SPEED;
        } else animating = false;
      }, 50))
  );
  onDestroy(() => window.clearInterval(intervalID));
</script>

<div bind:this={wrapper} class="marquee-wrapper" class:animating>
  <div
    bind:this={main}
    class="marquee"
    style="animation-duration: {animationDuration}s;"
  >
    <slot />
  </div>
</div>

<style lang="scss">
  @keyframes marquee {
    from {
      left: 100%;
    }
    to {
      left: 0%;
      transform: translateX(-100%);
    }
  }

  .marquee-wrapper {
    white-space: nowrap;
    width: 100%;
    max-width: 100%;
    position: relative;
    overflow: hidden;

    height: min-content;

    .marquee {
      width: max-content;
      will-change: left, transform;
      height: min-content;
    }

    &.animating .marquee {
      animation: infinite marquee linear;
    }
  }
</style>
