import { QueryInterface } from "sequelize";
import { Sequelize } from "sequelize-typescript";

export type MigrationContext = {
    context: QueryInterface,
    sequelize: Sequelize,
}