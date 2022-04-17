// #region Spotify
interface AccessToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

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
  album_type: "album" | "single";
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

interface User {
  country: string;
  display_name: string;
  email: string;
  explicit_content: {
    filter_enabled: boolean;
    filter_locked: boolean;
  };
  external_urls: {
    spotify: string;
  };
  followers: {
    href: unknown;
    total: number;
  };
  href: `https://api.spotify.com/v1/users/${string}`;
  id: string;
  images: [
    {
      height: null;
      url: string;
      width: null;
    }
  ];
  product: "open";
  type: "user";
  uri: `spotify:user:${string}`;
}
// #endregion

// #region Other
interface Skin {
  author: string;
  description: string;
  id: string;
  name: string;
  url: string;
}
// #endregion
