import { Action } from "routing-controllers";
import { Student } from "../models/student";

export class AuthenticationService {
	static authorizationChecker(action: Action, roles: string[]): boolean {
		if (roles.length === 0) {
			return true;
		}
		if (roles.includes("Admin")) {
			const authorization = action.request.headers["authorization"];
			return authorizationTokenIsValid(authorization);
		}
		return false;
	}
	public static async currentUserChecker(action: Action) {
		const studentId = action.request.headers["student-id"];
		return await Student.findOne({ where: { id: studentId } });
	}
}

function authorizationTokenIsValid(_token: string) {
	return false;
}