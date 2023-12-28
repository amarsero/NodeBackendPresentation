import { Controller, Param, Body, Get, QueryParam, HeaderParam, CookieParam, SessionParam, Post } from "routing-controllers";
import { StudentService } from "../services/studentService";

@Controller("/params")
export class ParametersController {

	// url: /params/42
	@Get("/:id")
	async getByIdParam(@Param("id") id: number) {
		return await StudentService.getAllById(id);
	}

	// url: /params/query?id=42
	@Get("/query")
	async getByIdQuery(@QueryParam("id") id: number) {
		return await StudentService.getAllById(id);
	}

	@Post("/body")
	async getByIdBody(@Body() body: { id: number }) {
		return await StudentService.getAllById(body.id);
	}

	@Get("/header")
	async getByIdHeader(@HeaderParam("id") id: number) {
		return await StudentService.getAllById(id);
	}

	@Get("/cookie")
	async getByIdCookie(@CookieParam("id") id: number) {
		return await StudentService.getAllById(id);
	}

	// Con express-session
	@Get("/sessionParam")
	async getByIdSessionParam(@SessionParam("userId") id: number) {
		return await StudentService.getAllById(id);
	}
}