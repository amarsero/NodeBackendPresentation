import { configure, format, transports } from "winston";

import { env } from "../env";
import * as Transport from "winston-transport";

export function setupWinston() {
	const logTransports: Transport[] = [
		new transports.Console({
			level: env.log.level,
			handleExceptions: true,
			format: env.isProduction
				? format.combine(
					format.json()
				)
				: format.combine(
					format.colorize(),
					format.simple(),
					format.timestamp(),
					format.errors(),
				),
			debugStdout: true,
			stderrLevels: ["info"]
		}),
	];

	if (env.log.file) {
		logTransports.push(new transports.File({
			filename: env.log.file,
			level: env.log.level,
		}));
	}

	configure({
		transports: logTransports,
		handleExceptions: true,
	});
}
