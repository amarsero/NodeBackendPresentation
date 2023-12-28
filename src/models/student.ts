import { Table, Column, Model } from "sequelize-typescript";

@Table({timestamps: true, tableName: "Students"})
export class Student extends Model {
	@Column
	public firstName!: string;
	@Column
	public lastName!: string;
	@Column
	public email!: string;
}

export default Student;