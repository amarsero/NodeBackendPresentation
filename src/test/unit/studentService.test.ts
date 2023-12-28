import { StudentService } from "../../services/studentService";
import { databaseSetup } from "../../setup/databaseSetup";

describe("StudentService", () => {
	beforeAll(() => {
		databaseSetup();
	});
	test("Should return student with id 42", async () => {
		const student = await StudentService.getById(42);
		expect(student).not.toBeNull();
		expect(student?.id).toBe(42);
	});
});
