import { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import { ExpressMiddlewareInterface, Middleware } from "routing-controllers";
import { Logger } from "../utils/logger";

@Middleware({ type: "before" })
export class LogMiddleware implements ExpressMiddlewareInterface {
	private log = new Logger("Request");
	public use(req: Request, res: Response, next: NextFunction) {
		return morgan("dev", {
			stream: { write: this.log.info.bind(this.log), },
		})(req, res, next);
	}
}
