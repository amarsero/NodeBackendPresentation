import { StudentService } from "../../services/studentService";
import { databaseSetup } from "../../setup/databaseSetup";

describe("StudentService", () => {
	beforeAll(async () => {
		await databaseSetup();
	});
	test("Should return students with id 42", async () => {
		const student = await StudentService.getAllById(42);
		expect(student).not.toBeNull();
	});
});
