import fse from "fs-extra";
const { readJSONSync, writeJSONSync } = fse;

import log from "./log.js";
import { fileExists } from "./tools.js";

export interface Settings {
  client_id: string;
  client_secret: string;
  ping_frequency: number;
  server_port: number;
}

const defaultSettings: Settings = {
  client_id: "<client_id>",
  client_secret: "<client_secret>",
  ping_frequency: 3000,
  server_port: 3000
};
const CONFIG_PATH = "./config.json";

export function readConfig(): Settings | never {
  const _ = log("Config");

  if (!fileExists(CONFIG_PATH)) {
    writeJSONSync(CONFIG_PATH, defaultSettings, { spaces: 2 });
    _().log(
      "config.json not found. A default config.json has been created, you may replace the placeholders with the according values"
    );
    process.exit(0);
  }

  const config: Settings = readJSONSync(CONFIG_PATH);

  if (typeof config?.client_id !== "string" || config?.client_id?.length !== 32)
    return _().throw("client_id is invalid");

  if (
    typeof config?.client_secret !== "string" ||
    config?.client_secret?.length !== 32
  )
    return _().throw("client_secret is invalid");

  if (typeof config?.ping_frequency !== "number") config.ping_frequency = 3000;

  if (config?.ping_frequency < 3000)
    _().warn("Low ping frequency values may result in unexpected behaviour");

  if (typeof config?.server_port !== "number")
    throw _().throw("server_port is invalid");

  return config;
}
