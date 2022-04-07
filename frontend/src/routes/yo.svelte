<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  import "../styles/global.scss";

  let latestData: Track = <Track>{};
  let currentTime: number;
  let lastUpdated: number = performance.now();
  let mainIntervalID: number;
  let smootherIntervalID: number;
  let ad: boolean;

  onMount(() => {
    mainIntervalID = window.setInterval(async () => {
      const latestDataResponse = await fetch("/api/latest-data");
      if (latestDataResponse.status !== 200) return;
      const newData = <Track>await latestDataResponse.json();
      if (newData.progress_ms !== latestData.progress_ms)
        lastUpdated = performance.now();
      latestData = newData;

      ad = latestData.currently_playing_type === "ad";
      songName = ad ? "Advertisement" : latestData.item.name;
      artist = ad ? "" : latestData.item.artists.map(e => e.name).join(", ");
      bgImg = latestData.item?.album?.images?.[0]?.url;
      mainImg = ad
        ? "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/800px-Spotify_logo_without_text.svg.png"
        : latestData.item.album.images[1].url;
    }, 50);
    smootherIntervalID = window.setInterval(async () => {
      if (!latestData || !latestData?.progress_ms) return;

      currentTime = Math.min(
        latestData.progress_ms + (performance.now() - lastUpdated),
        latestData.item?.duration_ms
      );

      progress.style.width = `${
        (currentTime / (latestData?.item?.duration_ms || currentTime)) * 100
      }%`;
      const timeFormatter = new Intl.DateTimeFormat("en-us", {
        minute: "numeric",
        second: "2-digit"
      });
      currentTimestamp = timeFormatter.format(currentTime || 0);
      endTimestamp = ad
        ? "?"
        : timeFormatter.format(latestData.item.duration_ms);
    });
  });
  onDestroy(() => {
    clearInterval(mainIntervalID);
    clearInterval(smootherIntervalID);
  });

  let progress: HTMLDivElement;

  let songName: string = "";
  let artist: string = "";
  let currentTimestamp: string = "00:00";
  let endTimestamp: string = "00:00";
  let bgImg: string = "";
  let mainImg: string = "";
</script>

<div id="card">
  <div class="background" style="background-image: url({bgImg})" />
  <div class="content">
    <img src={mainImg} alt="album cover art" />
    <div class="info">
      <div class="main-info">
        <span class="song-title">{songName}</span>
        <span class="song-artists">{artist}</span>
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
    overflow: hidden;
    height: 90px;
    width: 350px;
    border-radius: 7.5px;
    display: grid;

    transform: scale(2);

    > * {
      grid-column: 1 / 1;
      grid-row: 1 / 1;
    }

    .background {
      height: 100%;
      width: 100%;
      background-color: #000000;
      background-position: center;
      background-size: cover;
      border-radius: 7.5px;
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

      img {
        height: 100%;
        aspect-ratio: 1 / 1;
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

          max-width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
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
