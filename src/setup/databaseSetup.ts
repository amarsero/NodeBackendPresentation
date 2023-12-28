import { Sequelize, SequelizeOptions } from "sequelize-typescript";
import databaseConfig from "../database/config/config.json";
import { env } from "../env";
import { Logger } from "../utils/logger";

export async function databaseSetup() {
	const log = new Logger("Sequelize");
	try {
		const sequelize = new Sequelize({
			...databaseConfig[env.node_env] as SequelizeOptions,
			models: [__dirname + "/../models/*"],
			logging: (x) => log.debug(x),
		});
		await sequelize.authenticate();
		log.info("Connected to the database successfully");
	} catch (error) {
		log.error("Unable to connect to the database:", error);
	}
}