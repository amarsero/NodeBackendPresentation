import { RoutingControllersOptions, createExpressServer } from "routing-controllers";
import { Application } from "express";
import { join as pathJoin } from "path";
import { createServer } from "http";
import { AuthenticationService } from "../services/authenticationService";
import { formatAddresInfo } from "../utils/formatUtils";
import { Logger } from "../utils/logger";

export const routingControllersConfiguration: RoutingControllersOptions = {
	controllers: [pathJoin(__dirname, "../controllers/*{.js,.ts}")],
	middlewares: [pathJoin(__dirname, "../middlewares/*{.js,.ts}")],
	classTransformer: true,
	defaultErrorHandler: true,
	validation: true,
	authorizationChecker: AuthenticationService.authorizationChecker,
	currentUserChecker: AuthenticationService.currentUserChecker,
};
export function createExpress() {
	const app: Application = createExpressServer(routingControllersConfiguration);
	const server = createServer(app);
	server.on("listening", () => {
		const log = new Logger("App");
		const addressInfo = server.address();
		log.info(`Api listening on: ${formatAddresInfo(addressInfo)}`);
	});
	return { app, server };
}