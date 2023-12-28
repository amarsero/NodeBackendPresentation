import { Length, IsInt, Min, Max, IsEmail, IsDate } from "class-validator";

export class Message {
	@Length(10, 20)
		title: string;

	@IsInt()
	@Min(1)
	@Max(5)
		rating: number;

	@IsEmail()
		email: string;

	@IsDate()
		postedDate: Date;
}