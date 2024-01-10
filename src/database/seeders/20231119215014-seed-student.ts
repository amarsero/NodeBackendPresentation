import { faker } from "@faker-js/faker";
import { Student } from "../../models/student";
import { MigrationContext } from "../migrationContext";

export function createStudent() {
	const student = {
		firstName: faker.person.firstName(),
		lastName: faker.person.lastName(),
		email: faker.internet.email(),
	};
	return student;
}

export async function up(_context: MigrationContext) {
	const students = Array.from(Array(10)).map(() => createStudent());
	await Student.bulkCreate(students);
}