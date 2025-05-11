import { IncomingMessage, ServerResponse } from "http";
import { userController } from "../controllers/user.controller.ts";

export const routeHandler = (req: IncomingMessage, res: ServerResponse) => {
  userController(req, res);
};