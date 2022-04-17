import chalk from "chalk";
import fse from "fs-extra";
const { readJSONSync } = fse;

import { CONFIG_PATH } from "./config.js";
import { padding } from "./tools.js";

const rawConfig = readJSONSync(CONFIG_PATH);

interface ILog {
  error: (...data: any[]) => void;
  log: (...data: any[]) => void;
  success: (...data: any[]) => void;
  throw: (...data: any[]) => never;
  verbose: (...data: any[]) => void;
  warn: (...data: any[]) => void;
}
export default (scope?: string) =>
  (emoji?: string): ILog => {
    function _(
      emoji: string = "ℹ️",
      chalk: import("chalk").ChalkInstance,
      data: any[]
    ) {
      const _data = data
        .map(e => (typeof e === "object" ? JSON.stringify(e, null) : e))
        .join(" ");
      console.log(
        chalk(
          `${Intl.DateTimeFormat(undefined, {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
          }).format(new Date())} ` +
            padding(`${emoji} `, 3, "left") +
            (scope ? `[${scope}] ` : "") +
            _data
        )
      );
    }

    return {
      error: (...data) => _(emoji || "🚫", chalk.red, data),
      log: (...data) => _(emoji || "ℹ", chalk, data),
      success: (...data) => _(emoji || "✔", chalk.greenBright, data),
      throw: (...data) => {
        _(emoji || "🚫", chalk.red.inverse, data);
        throw "";
      },
      verbose: (...data) =>
        rawConfig.production || false
          ? undefined
          : _(emoji || "ℹ", chalk.rgb(127, 127, 127), data),
      warn: (...data) => _(emoji || "⚠", chalk.yellow, data)
    };
  };
