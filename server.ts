console.clear();

import log from "./log.js";
const _ = log();

import express from "express";
import path from "path";
import url from "url";

import { authFetch, authInfo, REDIRECT_URI, refreshToken } from "./auth.js";
import { readConfig } from "./config.js";
import { fileExists } from "./tools.js";

const { client_id, ping_frequency, production, server_port } = readConfig();

const app = express();
app.use(express.urlencoded({ extended: true }));

let svelte = false;

if (fileExists("./frontend/build/handler.js")) {
  svelte = true;
  (async () => {
    app.use(
      (
        await import(
          url.pathToFileURL(
            path.join(process.cwd(), "frontend/build/handler.js")
          ).href
        )
      ).handler
    );
  })();
} else
  _().warn(
    "Compiled Svelte app was not found. You will have to use the development version."
  );

app.get("/api/login", (req, res) => {
  res.redirect(
    302,
    `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=user-read-currently-playing&show_dialog=true`
  );

  _().verbose("Redirected to Spotify account login");
});

let currentlyPlaying: Track;
let mainIntervalID: NodeJS.Timer;
let refreshTokenIntervalID: NodeJS.Timer;
app.get("/api/login-callback", async (req, res) => {
  if (mainIntervalID) clearInterval(mainIntervalID);
  if (refreshTokenIntervalID) clearInterval(refreshTokenIntervalID);

  authInfo.code = <string>req.query.code;
  await refreshToken();

  mainIntervalID = setInterval(async () => {
    const currentlyPlayingResponse = await authFetch(
      "https://api.spotify.com/v1/me/player/currently-playing"
    );
    if (currentlyPlayingResponse.status !== 200) return;
    currentlyPlaying = <Track>await currentlyPlayingResponse.json();

    if (production || !currentlyPlaying?.item) return;

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

  res
    .status(200)
    .send(
      `<script>location = "http://localhost:${
        svelte ? server_port : 3001
      }"</script>`
    );
});

app.get("/api/latest-data", (req, res) =>
  res.status(200).send(currentlyPlaying || null)
);

app.get("/api/current-user", async (req, res) => {
  const currentUserResponse = await authFetch("https://api.spotify.com/v1/me");
  if (!currentUserResponse || currentUserResponse.status !== 200)
    return res.status(200).send({ msg: "not logged in" });
  else res.status(200).send(await currentUserResponse.json());
});

app.get("/api/log-out", async (req, res) => {
  if (mainIntervalID) clearInterval(mainIntervalID);
  if (refreshTokenIntervalID) clearInterval(refreshTokenIntervalID);
  authInfo.code = undefined;
  authInfo.token = undefined;

  res.status(200).send();
});

if (!svelte)
  app.get("*", (req, res) =>
    res
      .status(200)
      .send(
        "<code>⚠️ Compiled Svelte app was not found. You will have to use the development version.</code>"
      )
  );

app.listen(server_port, () =>
  _("🌐").log(`Server running on http://localhost:${server_port}`)
);
