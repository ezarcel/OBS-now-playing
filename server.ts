console.clear();

import log from "./log.js";
const _ = log();

import express from "express";

import { authFetch, authInfo, REDIRECT_URI, refreshToken } from "./auth.js";
import { readConfig } from "./config.js";

const { client_id, ping_frequency, server_port } = readConfig();

const app = express();
app.use(express.urlencoded({ extended: true }));

app.get("/api/login", (req, res) => {
  res.redirect(
    302,
    `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=user-read-currently-playing`
  );

  _().verbose("Redirected to Spotify account login");
});

let currentlyPlaying: Track;
let mainIntervalID: NodeJS.Timer;
let refreshTokenIntervalID: NodeJS.Timer;
app.get("/api/login-callback", async (req, res) => {
  if (mainIntervalID) clearInterval(mainIntervalID);
  if (refreshTokenIntervalID) clearInterval(refreshTokenIntervalID);

  res.status(200).send();

  authInfo.code = <string>req.query.code;
  await refreshToken();

  mainIntervalID = setInterval(async () => {
    const currentlyPlayingResponse = await authFetch(
      "https://api.spotify.com/v1/me/player/currently-playing"
    );
    if (currentlyPlayingResponse.status !== 200) return;
    currentlyPlaying = <Track>await currentlyPlayingResponse.json();

    if (!currentlyPlaying?.item) return;

    const timeFormatter = new Intl.DateTimeFormat("en-us", {
      minute: "numeric",
      second: "2-digit"
    });
    const progress = timeFormatter.format(currentlyPlaying.progress_ms);
    const length = timeFormatter.format(
      currentlyPlaying.item?.duration_ms || 0
    );
    const name =
      currentlyPlaying.currently_playing_type === "ad"
        ? "Advertisement"
        : currentlyPlaying?.item?.name;
    const artists =
      currentlyPlaying.currently_playing_type === "ad"
        ? "Spotify"
        : currentlyPlaying.item.artists.map(e => e.name).join(", ");

    _("🎵").verbose(`(${progress}/${length}) ${name} — ${artists}`);
  }, ping_frequency);
  refreshTokenIntervalID = setInterval(refreshToken, 1_800_000);
});

app.get("/api/latest-data", (req, res) =>
  res.status(200).send(currentlyPlaying || null)
);

app.listen(server_port, () =>
  _("🌐").log(`Server running on http://localhost:${server_port}`)
);
