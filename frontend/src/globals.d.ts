// #region Spotify
interface Track {
  currently_playing_type?: "ad";
  actions?: {
    disallows?: {
      resuming?: boolean;
      seeking?: boolean;
      skipping_prev?: boolean;
      skipping_next?: boolean;
      interrupting_playback?: boolean;
      transferring_playback?: boolean;
    };
  };
  timestamp: number;
  context: {
    external_urls: {
      spotify: string;
    };
    href: string;
    type: "playlist";
    uri: `spotify:${string}`;
  };
  progress_ms: number;
  is_playing?: boolean;
  item?: {
    album: Album;
    artists: Artist[];
    available_markets: string[];
    disc_number: number;
    duration_ms: number;
    explicit: boolean;
    external_ids: { isrc: string };
    external_urls: {
      spotify: `https://open.spotify.com/track/${string}`;
    };
    href: `https://api.spotify.com/v1/tracks/${string}`;
    id: string;
    is_local: boolean;
    name: string;
    popularity: number;
    preview_url: string;
    track_number: number;
    type: "track";
    uri: `spotify:track:${string}`;
  };
}
interface Album {
  album_type: "album";
  artists: Artist[];
  available_markets: string[];
  external_urls: {
    spotify: `https://open.spotify.com/album/${string}`;
  };
  href: `https://api.spotify.com/v1/albums/${string}`;
  id: string;
  images: Image[];
  name: string;
  release_date: string;
  release_date_precision: "day";
  total_tracks: number;
  type: "album";
  uri: `spotify:album:${string}`;
}
interface Image {
  height: number;
  url: string;
  width: number;
}
interface Artist {
  external_urls: {
    spotify: `https://open.spotify.com/artist/${string}`;
  };
  href: `https://api.spotify.com/v1/artists/${string}`;
  id: string;
  name: string;
  type: "artist";
  uri: `spotify:artist:${string}`;
}
// #endregion

// #region Icons
type IconStyle = "brand" | "duotone" | "light" | "regular" | "solid" | "thin";
type IconSize = "2xs" | "xs" | "sm" | "lg" | "xl" | "2xl" | "";
interface IconDefinition {
  fixedWidth?: boolean;
  margin?: boolean;
  name: string;
  size?: IconSize;
  style?: IconStyle;
  swapOpacity?: boolean;
}
// #endregion
