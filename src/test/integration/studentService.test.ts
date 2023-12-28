import { SecurityService } from "../../services/securityService";
import { StudentService } from "../../services/studentService";
import { databaseSetup } from "../../setup/databaseSetup";

describe("SecurityService", () => {
	beforeAll(() => {
		databaseSetup();
	});
	test("Generate a valid JWT token with studentId", async () => {
		const student = await StudentService.getById(42);
        const jwt = SecurityService.generateJWT(student);
        const isValidJwt = SecurityService.validateJWT(jwt);
        expect(isValidJwt).toBe(true);

        const studentId = SecurityService.extractStudentId(jwt);
        expect(studentId).toBe(student?.id);
	});
});
