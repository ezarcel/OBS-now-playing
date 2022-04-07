import fetch, { Response, RequestInfo, RequestInit } from "node-fetch";

import { readConfig } from "./config.js";
import log from "./log.js";

const { client_id, client_secret, server_port } = readConfig();
const _ = log("Auth");

export const REDIRECT_URI = `http://localhost:${server_port}/authorize`;

export let authInfo: {
  code: string;
  token: AccessToken;
} = {
  code: undefined,
  token: undefined
};

export async function refreshToken() {
  _().verbose("Getting tokens...");

  const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Basic ${Buffer.from(
        `${client_id}:${client_secret}`
      ).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      redirect_uri: REDIRECT_URI,
      ...(authInfo?.token?.refresh_token
        ? {
            refresh_token: authInfo.token.refresh_token,
            grant_type: "refresh_token"
          }
        : {
            code: authInfo.code,
            grant_type: "authorization_code"
          })
    })
  });
  authInfo.token = {
    ...authInfo?.token,
    ...(<AccessToken>await tokenResponse.json())
  };

  _().verbose("Success!");
}

export function authFetch(
  url: RequestInfo,
  init?: RequestInit
): Promise<Response> {
  if (!authInfo.token) return;
  return fetch(url, {
    ...init,
    headers: {
      ...init?.headers,
      Accept: "application/json",
      Authorization: `Bearer ${authInfo.token.access_token}`
    }
  });
}
