import Student from "../models/student";

export class StudentService {
	public static async getById(id: number) {
		return Student.findOne({ where: { id } });
	}
	public static async getAllById(id: number) {
		return Student.findAll({ where: { id } });
	}
}