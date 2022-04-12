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
      const timeFormatter = new Intl.DateTimeFormat("en-us", {
        minute: "numeric",
        second: "2-digit"
      });
      currentTimestamp = timeFormatter.format(currentTime || 0);
      endTimestamp = $nowPlaying.ad
        ? "00:00"
        : timeFormatter.format($latestData.item.duration_ms);
    }, 1);
  });
  onDestroy(() => clearInterval(intervalID));

  let progress: HTMLDivElement;

  let artists: string = "";
  // @ts-ignore The class does exist, but its type doesn't.
  $: artists = new Intl.ListFormat().format($nowPlaying.artists);
  let currentTimestamp: string = "00:00";
  let endTimestamp: string = "00:00";
</script>

<div id="card">
  {#each ["primary", "secondary"] as i}
    <div
      class="background-{i}"
      style="background-image: url({$nowPlaying.ad ? '' : $nowPlaying.imgURL})"
    />
  {/each}
  <div class="content">
    <div class="album-cover-wrapper">
      <img class="album-cover" src={$nowPlaying.imgURL} alt="album cover art" />
      <div
        class="pause-overlay"
        class:visible={$nowPlaying.status === "paused"}
      >
        <Icon name="pause" />
      </div>
    </div>
    <div class="info">
      <div class="main-info">
        <Marquee>
          <span class="song-title">{$nowPlaying.songName}</span>
        </Marquee>
        <Marquee>
          <span class="song-artists">
            {artists}
            {$nowPlaying.album ? "—" : ""}
            {$nowPlaying.album}
          </span>
        </Marquee>
      </div>
      <div class="song-progress">
        {#key currentTimestamp}
          <div class="timestamps">
            <span class="current-time">{currentTimestamp}</span>
            <span class="full-time">{endTimestamp}</span>
          </div>
        {/key}
        <div class="progress-bar">
          <div class="progress" bind:this={progress} />
        </div>
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  #card {
    transform: scale(2);

    overflow: hidden;
    height: 90px;
    width: 350px;
    border-radius: 7.5px;
    display: grid;

    > * {
      grid-column: 1 / 1;
      grid-row: 1 / 1;
    }

    .background-primary {
      background-color: #000000;
      background-position: center;
      background-size: cover;
      border-radius: 7.5px;
      filter: blur(7.5px);
      transform: scale(1.1666);
    }
    .background-secondary {
      z-index: -1;
    }

    .content {
      z-index: 999;
      overflow: hidden;
      padding: 10px;
      display: flex;
      flex-direction: row;
      gap: 10px;
      color: white;
      background-color: #0000007f;
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

        .main-info {
          display: flex;
          flex-direction: column;
        }

        .song-artists,
        .song-progress {
          font-size: 12px;
          font-weight: 100;
        }

        .song-progress {
          display: flex;
          flex-direction: column;
          gap: 5px;

          .timestamps {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            width: 100%;
          }

          .progress-bar {
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
    }
  }
</style>
