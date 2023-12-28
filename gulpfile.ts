import { spawn } from "node:child_process";
import { copyFile, mkdir, unlink, writeFile, readFile } from "node:fs/promises";
import { createInterface } from "node:readline/promises";

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

const sequelizePaths = ["--config", "./database/config/config.json",
	"--migrations-path", "./database/migrations/",
	"--seeders-path", "./database/seeders/",];

export async function migrateUp() {
	await build();
	await runCommand(["npx", "sequelize-cli", "db:migrate", ...sequelizePaths], "/dist");
}

export async function migrateRecreate() {
	await askConfirmation("You are going to drop and create the database. Are you sure?");
	await build();
	const usingSqlite = true;
	if (usingSqlite) {
		try {
			await unlink("dist/db.sqlite3");
		} catch (error) {
			console.error("Database not found dist/db.sqlite3");
		}
	} else {
		await runCommand(["npx", "sequelize-cli", "db:drop", ...sequelizePaths], "/dist");
	}
	await runCommand(["npx", "sequelize-cli", "db:migrate", ...sequelizePaths], "/dist");
	await runCommand(["npx", "sequelize-cli", "db:seed:all", ...sequelizePaths], "/dist");
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