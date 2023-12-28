
import { validationMetadatasToSchemas } from "class-validator-jsonschema";
import { Application } from "express";
import { Server } from "http";
import { getMetadataArgsStorage } from "routing-controllers";
import { routingControllersToSpec } from "routing-controllers-openapi";
import openApiUi from "swagger-ui-express";
import { formatAddresInfo } from "../utils/formatUtils";
import { routingControllersConfiguration } from "./expressSetup";
import { env } from "../env";
import { Logger } from "../utils/logger";

export function setupOpenApi(express: Application, server: Server) {
	const log = new Logger("OpenApi");
	if (!env.openApi.enabled) {
		log.info("OpenApi disabled.");
		return;
	}
	const schemas = validationMetadatasToSchemas({
		refPointerPrefix: "#/components/schemas/",
	}) as { [schema: string]: object; };
	const openApiFile = routingControllersToSpec(
		getMetadataArgsStorage(),
		routingControllersConfiguration,
		{
			components: { schemas, },
		});
	openApiFile.info = {
		title: "Open Api",
		version: "1.0.0",
	};
	openApiFile.servers = [{ url: `http://${env.app.host}:${env.app.port}${env.app.routePrefix}`, },];
	express.use(env.openApi.route, openApiUi.serve, openApiUi.setup(openApiFile));
	server.on("listening", () => {
		const addressInfo = server.address();
		log.info(`OpenApi listening on: ${formatAddresInfo(addressInfo)}${env.openApi.route}`);
	});
}