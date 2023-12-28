import { DataTypes, QueryInterface, Sequelize } from "sequelize";

export async function up(queryInterface: QueryInterface, _sequelize: Sequelize) {
	await queryInterface.createTable("Students", {
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
export async function down(queryInterface: QueryInterface, _sequelize: Sequelize) {
	await queryInterface.dropTable("Students");
}