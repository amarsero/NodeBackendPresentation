import { sep } from "path";
import { log as winstonLog } from "winston";
import { env } from "../env";
/* eslint-disable  @typescript-eslint/no-explicit-any */
export class Logger {
	private scope: string;
	constructor(scope: string) {
		this.scope = parsePathToScope(scope);
	}
	public debug(message: string, ...args: any[]): void {
		this.log("debug", message, args);
	}

	public info(message: string, ...args: any[]): void {
		this.log("info", message, args);
	}

	public warn(message: string, ...args: any[]): void {
		this.log("warn", message, args);
	}

	public error(message: string, ...args: any[]): void {
		this.log("error", message, args);
	}

	public log(level: string, message: string, args: any[]): void {
		if (env.isTest){
			return;
		}
		winstonLog(level, `${this.formatScope()} ${message}`, args);
	}

	private formatScope(): string {
		return `[${this.scope}]`;
	}
}

function parsePathToScope(filepath: string): string {
	if (filepath.indexOf(sep) >= 0) {
		filepath = filepath.replace(process.cwd(), "");
		filepath = filepath.replace(`${sep}src${sep}`, "");
		filepath = filepath.replace(`${sep}dist${sep}`, "");
		filepath = filepath.replace(".ts", "");
		filepath = filepath.replace(".js", "");
		filepath = filepath.replace(sep, ":");
	}
	return filepath;
}