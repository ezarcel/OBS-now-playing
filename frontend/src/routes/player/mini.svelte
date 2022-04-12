<script lang="ts">
  import Icon from "../../components/Icon.svelte";
  import Marquee from "../../components/Marquee.svelte";

  import { nowPlaying, lastUpdated, latestData } from "../../stores";

  import { onDestroy, onMount } from "svelte";

  let currentTime: number;
  let intervalID: number;
  onMount(() => {
    intervalID = window.setInterval(async () => {
      if (!$latestData || !$latestData?.progress_ms) return;

      currentTime = Math.min(
        $latestData.progress_ms +
          ($latestData.is_playing ? Date.now() - $lastUpdated : 0),
        $latestData.item?.duration_ms
      );

      progress.style.width = `${
        (currentTime / ($latestData?.item?.duration_ms || currentTime)) * 100
      }%`;
    }, 1);
  });
  onDestroy(() => clearInterval(intervalID));

  let progress: HTMLDivElement;

  let artists: string = "";
  // @ts-ignore The class does exist, but its type doesn't.
  $: artists = new Intl.ListFormat().format($nowPlaying.artists);
</script>

<div id="card">
  <div class="album-cover-wrapper">
    <img class="album-cover" src={$nowPlaying.imgURL} alt="album cover art" />
    <div class="pause-overlay" class:visible={$nowPlaying.status === "paused"}>
      <Icon name="pause" />
    </div>
  </div>
  <div class="info">
    <div class="main-info">
      <Marquee>
        <div class="main-info-inner">
          <span class="song-title">{$nowPlaying.songName}</span>
          <span class="song-artists">{artists ? "—" : ""} {artists}</span>
        </div>
      </Marquee>
    </div>
    <div class="song-progress">
      <div class="progress-bar">
        <div class="progress" bind:this={progress} />
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  #card {
    transform: scale(2);

    overflow: hidden;
    height: 60px;
    width: 250px;

    display: flex;
    flex-direction: row;
    color: white;
    background-color: #000000aa;
    border-radius: 7.5px;

    .album-cover-wrapper {
      position: relative;

      .album-cover {
        height: 100%;
        aspect-ratio: 1 / 1;
      }

      .pause-overlay {
        position: absolute;
        inset: 0;
        background-color: #0000007f;
        display: flex;
        place-items: center;
        justify-content: center;
        font-size: 32px;
        transition: opacity 250ms;

        &:not(.visible) {
          opacity: 0;
        }
      }
    }

    .info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 100%;
      height: 100%;
      max-width: 100%;
      overflow: hidden;
      padding: 10px;

      .main-info-inner {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 5px;
      }

      .song-artists {
        font-size: 12px;
        font-weight: 100;
      }

      .song-progress .progress-bar {
        width: 100%;
        height: 2.5px;
        background-color: #ffffff7f;
        border-radius: 99px;

        .progress {
          height: 100%;
          background-color: #ffffff;
          width: 100%;
          border-radius: 99px;
        }
      }
    }
  }
</style>
