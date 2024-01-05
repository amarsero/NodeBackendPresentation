import { databaseSetup } from "../../setup/databaseSetup";
import { createExpress as expressSetup } from "../../setup/expressSetup";
import { setupWinston as winstonSetup } from "../../setup/winstonSetup";

export type TestContext = Awaited<ReturnType<typeof e2ETestSetup>>;
export const e2ETestSetup = async () => {
	winstonSetup();
	const connection = await databaseSetup();
	const express = expressSetup();
	return {
		express,
		connection,
	};
};
