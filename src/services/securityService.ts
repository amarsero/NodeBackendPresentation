import Student from "../models/student";

export class SecurityService {
	public static generateJWT(student: Student | null) {
		return "MockToken";
	}
	public static validateJWT(jwt: string) {
		return true;
	}
	public static extractStudentId(jwt: string) {
		return undefined;
	}
}