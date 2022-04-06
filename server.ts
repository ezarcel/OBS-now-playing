console.clear();

import log from "./log.js";
const _ = log();

import express from "express";
import jimp from "jimp";
import fetch from "node-fetch";

import { readConfig } from "./config.js";

const { client_id, client_secret, ping_frequency, server_port } = readConfig();

const REDIRECT_URL = `http://localhost:${server_port}/authorize`;

const app = express();
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.redirect(
    302,
    `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=code&redirect_uri=${REDIRECT_URL}&scope=user-read-currently-playing&show_dialog=true`
  );

  _().verbose("Redirected to Spotify account login");
});

let mainIntervalID: NodeJS.Timer;
let refreshTokenIntervalID: NodeJS.Timer;
let currentlyPlaying: Track;
app.get("/authorize", async (req, res) => {
  if (mainIntervalID) clearInterval(mainIntervalID);
  if (refreshTokenIntervalID) clearInterval(refreshTokenIntervalID);

  res.status(200).send("You may now close this tab");

  let token = <AccessToken>{};
  async function refreshToken() {
    _().verbose("Getting tokens...");

    const tokenResponse = await fetch(
      "https://accounts.spotify.com/api/token",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Basic ${Buffer.from(
            `${client_id}:${client_secret}`
          ).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          redirect_uri: REDIRECT_URL,
          ...(token?.refresh_token
            ? {
                refresh_token: token.refresh_token,
                grant_type: "refresh_token"
              }
            : {
                code: <string>req.query.code,
                grant_type: "authorization_code"
              })
        })
      }
    );
    token = { ...token, ...(<AccessToken>await tokenResponse.json()) };

    _().verbose("Success!");
  }

  await refreshToken();

  let lastImage: string;
  let lastImageURL: string;
  mainIntervalID = setInterval(async () => {
    const currentlyPlayingResponse = await fetch(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token.access_token}`
        }
      }
    );
    if (currentlyPlayingResponse.status !== 200) return;
    currentlyPlaying = <Track>await currentlyPlayingResponse.json();

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
        : currentlyPlaying.item.name;
    const artists =
      currentlyPlaying.currently_playing_type === "ad"
        ? "Spotify"
        : currentlyPlaying.item.artists.map(e => e.name).join(", ");

    const newUrl = currentlyPlaying.item?.album?.images?.[0].url;
    if (newUrl && lastImageURL !== newUrl && !newUrl.startsWith("data:")) {
      lastImage = await (await jimp.read(newUrl))
        .blur(16)
        .getBase64Async("image/jpeg");
      lastImageURL = newUrl;
    }

    currentlyPlaying.item.album.images = [
      { ...currentlyPlaying.item.album.images[0], url: lastImage },
      ...currentlyPlaying.item.album.images
    ];

    _("🎵").verbose(`(${progress}/${length}) ${name} — ${artists}`);
  }, ping_frequency);
  refreshTokenIntervalID = setInterval(refreshToken, 1_800_000);
});

app.get("/api/latest-data", async (req, res) => {
  if (currentlyPlaying) res.status(200).send(currentlyPlaying);
  else res.status(500).send();
});

app.listen(server_port, () => {
  _().log(`Server running on port ${server_port}`);
  _().log(`Log in in http://localhost:${server_port}`);
});
