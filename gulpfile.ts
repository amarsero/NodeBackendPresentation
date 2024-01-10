import { spawn } from "node:child_process";
import { copyFile, mkdir, writeFile, readFile } from "node:fs/promises";
import { createInterface } from "node:readline/promises";
import { databaseSetup } from "./src/setup/databaseSetup";
import { Umzug, SequelizeStorage } from "umzug";
import { Sequelize } from "sequelize-typescript";

export async function build() {
	await runCommand(["npx", "tsc"]);
	await mkdir("dist/database/config/", { recursive: true });
	await copyFile("src/database/config/config.json", "dist/database/config/config.json");
	try {
		await readFile(".env");
	} catch (error) {
		await copyFile(".env", "./dist/.env");
	}
}

export async function buildRun() {
	await build();
	await runCommand(["node", "index.js"], "/dist");
}

let dbConnect: Sequelize | undefined = undefined;
async function getDatabaseConnection() {
	if (dbConnect === undefined) {
		const sequelize = await databaseSetup();
		if (sequelize === undefined) {
			throw new Error("Couldn't connect to database");
		}
		sequelize.options.logging = false;
		dbConnect = sequelize;
	}
	return dbConnect as Sequelize;
}

async function createMigrationHelper(path: string) {
	const sequelize = await getDatabaseConnection();
	const migration = new Umzug({
		migrations: { glob: path },
		context: sequelize.getQueryInterface(),
		storage: new SequelizeStorage({ sequelize }),
		logger: console,
	});
	return migration;
}

export async function migrateUp() {
	const seeder = await createMigrationHelper("./src/database/migrations/*.[tj]s");
	await seeder.up();
}

export async function migrateRecreate() {
	await askConfirmation("You are going to drop and recreate the database. Are you sure?");

	const sequelize = await getDatabaseConnection();
	await sequelize.drop();
	// Drop table that has the migrations log
	await sequelize.dropSchema("SequelizeMeta", {});

	await migrateUp();

	const seeder = await createMigrationHelper("./src/database/seeders/*.[tj]s");
	await seeder.up();
}

export async function migrationCreate() {
	const modelName = await getInput("Write model name:");
	const date = new Date();
	const dateString = date.getFullYear() +
		(date.getMonth() + 1).toString().padStart(2, "0") +
		date.getDate().toString().padStart(2, "0") +
		date.getHours().toString().padStart(2, "0") +
		date.getMinutes().toString().padStart(2, "0") +
		date.getSeconds().toString().padStart(2, "0");
	const fileName = `${dateString}-create-${modelName.toLowerCase()}.ts`;
	const capitalizedModelName = modelName[0].toUpperCase() + modelName.slice(1);
	const fileContent = `import { DataTypes, QueryInterface, Sequelize } from "sequelize";\n\nexport async function up(queryInterface: QueryInterface, sequelize: Sequelize) {\n\tawait queryInterface.createTable("${capitalizedModelName}", {\n\t\tid: {\n\t\t\tallowNull: false,\n\t\t\tautoIncrement: true,\n\t\t\tprimaryKey: true,\n\t\t\ttype: DataTypes.INTEGER\n\t\t},\n\t\tcreatedAt: {\n\t\t\tallowNull: false,\n\t\t\ttype: DataTypes.DATE,\n\t\t\tdefaultValue: new Date(),\n\t\t},\n\t\tupdatedAt: {\n\t\t\tallowNull: false,\n\t\t\ttype: DataTypes.DATE,\n\t\t\tdefaultValue: new Date(),\n\t\t}\n\t});\n};\nexport async function down(queryInterface: QueryInterface, sequelize: Sequelize) {\n\tawait queryInterface.dropTable("${capitalizedModelName}");\n};`;
	await writeFile("./src/database/migrations/" + fileName, fileContent);
}

async function runCommand(command: string[], cwd?: string) {
	return new Promise((res) => {
		const cmdCommands = ["npm", "npx"];
		const initCommand = (cmdCommands.includes(command[0]) && process.platform.includes("win")) ?
			`${command[0]}.cmd` : command[0];
		const workingDirectory = cwd !== undefined ? (__dirname + cwd) : undefined;
		const ls = spawn(initCommand, command.slice(1), { cwd: workingDirectory });
		ls.stdout.on("data", (data: Buffer) => {
			console.log(data.toString());
		});
		ls.stderr.on("data", (data: Buffer) => {
			console.error(data.toString());
		});
		ls.on("close", (code: number) => {
			res(code);
		});
	});
}

async function getInput(question: string) {
	const rl = createInterface({
		input: process.stdin,
		output: process.stdout,
	});
	const result = await rl.question(question);
	rl.close();
	return result;
}

async function askConfirmation(question: string) {
	const rl = createInterface({
		input: process.stdin,
		output: process.stdout,
	});
	let result = "";
	while (result !== "yes" && result !== "no") {
		result = (await rl.question(question + " (yes/no): ")).toLowerCase();
	}
	rl.close();
	if (result === "no") {
		throw new Error("Aborted");
	}
}