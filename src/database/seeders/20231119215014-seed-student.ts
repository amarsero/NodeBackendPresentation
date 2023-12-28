import { QueryInterface, Sequelize } from "sequelize";
import { faker } from "@faker-js/faker";
import { Student } from "../../models/student";

export async function createStudent() {
	const student = Student.build({
		firstName: faker.person.firstName(),
		lastName: faker.person.lastName(),
		email: faker.internet.email(),
	});
	return student;
}

export async function up(queryInterface: QueryInterface, _sequelize: Sequelize) {
	await queryInterface.bulkInsert("Student",
		Array.from(Array(10)).map(() => createStudent()), {});
}