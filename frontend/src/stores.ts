import { writable } from "svelte/store";

type Status = "playing" | "paused" | "stopped";

const SPOTIFY_LOGO_URL =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/800px-Spotify_logo_without_text.svg.png";

export const latestData = writable<Track>();
let _latestData: Track;
latestData.subscribe(a => (_latestData = a));

export const lastUpdated = writable<number>();
// let _lastUpdated: number;
// lastUpdated.subscribe(a => (_lastUpdated = a));

interface NowPlaying {
  ad: boolean;
  album: string;
  artists: string[];
  imgURL: string;
  songName: string;
  status: Status;

  update(newData: Partial<Exclude<NowPlaying, "update">>): void;
}
export const nowPlaying = writable<NowPlaying>(<NowPlaying>{
  update(newData) {
    nowPlaying.update(self => ({ ...self, ...newData, update: self.update }));
  }
});
let _nowPlaying: NowPlaying;
nowPlaying.subscribe(a => (_nowPlaying = a));

export function init() {
  async function _() {
    const latestDataResponse = await fetch("/api/latest-data");
    if (latestDataResponse.status !== 200) return;

    const newData = <Track>await latestDataResponse.json();
    if (newData.progress_ms !== _latestData?.progress_ms)
      lastUpdated.set(Date.now());
    latestData.set(newData);

    _nowPlaying.update({
      ad: _latestData.currently_playing_type === "ad",
      album: _latestData?.item?.album?.name,
      artists: _latestData?.item?.artists?.map?.(e => e.name),
      imgURL: _nowPlaying.ad
        ? SPOTIFY_LOGO_URL
        : _latestData?.item?.album?.images?.[0]?.url || SPOTIFY_LOGO_URL,
      songName: _nowPlaying.ad
        ? "Advertisement"
        : _latestData?.item?.name || "",
      status: (() => {
        if (_latestData.is_playing) return "playing";
        else if (_latestData?.item) return "paused";
        else return "stopped";
      })()
    });

    _();
  }

  _();
}
