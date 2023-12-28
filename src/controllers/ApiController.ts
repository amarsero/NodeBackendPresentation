import { Param, Body, Get, Post, Put, Delete, JsonController } from "routing-controllers";
import { Student } from "../models/student";

@JsonController("/api")
export class ApiController {
	@Get("/userOfTheMonth")
	getUserOfTheMonth() {
		return { name: "Pedro" };
	}

	@Get("/error")
	showError() {
		throw new Error("Pedro no existe");
	}

	@Post("")
	post(@Body() student: Student) {
		return "Saving student..." + JSON.stringify(student);
	}

	@Put("/:id")
	put(@Param("id") id: number) {
		return "Updating a student..." + id.toString();
	}

	@Delete("/:id")
	remove(@Param("id") id: number) {
		return "Removing student..." + id.toString();
	}
}


