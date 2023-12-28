import dotenv from "dotenv";
import path from "path";

const envPath = path.join(process.cwd(), ".env");
dotenv.config({ path: envPath });

export const env = {
	node_env: (process.env.NODE_ENV ?? "development") as "development" | "test" | "production",
	isProduction: process.env.NODE_ENV === "production",
	isTest: process.env.NODE_ENV === "test",
	isDevelopment: process.env.NODE_ENV === "development",
	app: {
		host: requiredEnv("APP_HOST"),
		schema: requiredEnv("APP_SCHEMA"),
		routePrefix: optionalEnv("APP_ROUTE_PREFIX") ?? "/",
		port: requiredEnvNum("APP_PORT"),
	},
	log: {
		level: optionalEnv("LOG_LEVEL") ?? "info",
		file: optionalEnv("LOG_FILE"),
	},
	openApi: {
		enabled: optionalEnv("OPENAPI_ENABLED") === "true",
		route: requiredEnv("OPENAPI_ROUTE"),
		username: optionalEnv("OPENAPI_USERNAME"),
		password: optionalEnv("OPENAPI_PASSWORD"),
	},
};

function requiredEnv(key: string): string {
	const value = optionalEnv(key);
	if (typeof value === "undefined") {
		throw new Error(`Environment variable ${key} is not set.`);
	}
	return value as string;
}

function optionalEnv(key: string): string | undefined {
	return process.env[key];
}

function requiredEnvNum(key: string): number | undefined {
	return parseInt(requiredEnv(key));
}
