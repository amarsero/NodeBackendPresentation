import { DataTypes } from "sequelize";
import { MigrationContext } from "../migrationContext";

export async function up({ context }: MigrationContext) {
	await context.createTable("Students", {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		firstName: {
			type: DataTypes.STRING
		},
		lastName: {
			type: DataTypes.STRING
		},
		email: {
			type: DataTypes.STRING
		},
		createdAt: {
			allowNull: false,
			type: DataTypes.DATE,
			defaultValue: new Date(),
		},
		updatedAt: {
			allowNull: false,
			type: DataTypes.DATE,
			defaultValue: new Date(),
		}
	});
}
export async function down({ context }: MigrationContext) {
	await context.dropTable("Students");
}