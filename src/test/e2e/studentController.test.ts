import request from "supertest";
import { TestContext, e2ETestSetup } from "../utils/testUtils";

describe("StudentController", () => {
	let context: TestContext;
	beforeAll(async () => {
		context = await e2ETestSetup();
	});
	test("Should return student with id 42", async () => {
		const response = await request(context.express.app)
			.get("/api/userOfTheMonth")
			.expect("Content-Type", /json/)
			.expect(200);
		const body: { name: string } = response.body;
		expect(body).toBeDefined();
		expect(body.name).toHaveLength(5);
	});
});
