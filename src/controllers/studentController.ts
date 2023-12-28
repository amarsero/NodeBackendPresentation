import { Controller, Get, Authorized, CurrentUser, Body, Post } from "routing-controllers";
import { Student } from "../models/student";
import { Message } from "./requests/sutdent/messageRequest";

@Controller("/student")
export class StudentController {
	@Get("")
	getAll() {
		const students = Student.findAll();
		return students;
	}

	@Get("/currentStudent")
	getSelf(@CurrentUser({ required: true }) student: Student) {
		return student;
	}

	@Get("/error")
	showError() {
		throw new Error("Student not found");
	}

	@Post("/createMessage")
	createMessage(@Body() message: Message) {
		return message;
	}

	@Authorized("SuperAdmin")
	@Get("/unauthorized")
	unauthorized() {
		return "Authorized!";
	}
}