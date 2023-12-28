import "reflect-metadata";
import { createExpress } from "./setup/expressSetup";
import { setupOpenApi } from "./setup/openApiSetup";
import { databaseSetup as setupDatabase } from "./setup/databaseSetup";
import { env } from "./env";
import { setupWinston } from "./setup/winstonSetup";

function main() {
	setupWinston();
	const { app, server } = createExpress();
	setupOpenApi(app, server);
	setupDatabase();
	server.listen(env.app.port, env.app.host);
}	

main();