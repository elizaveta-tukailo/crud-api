import { IncomingMessage, ServerResponse } from "http";
import { parse } from "url";
import { userService } from "../services/user.service.ts";
import { validateUserId } from "../utils/validateUserId.ts";

const USERS_URL = "/api/users";

enum HTTP_METHOD {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE"
}

const handleResponse = (res: ServerResponse, status: number, data?: unknown) => {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(data ? JSON.stringify(data) : undefined);
};

export const userController = async (req: IncomingMessage, res: ServerResponse) => {
  const { pathname } = parse(req.url!, true);
  const id = pathname?.split("/")[3];

  try {
    switch (req.method) {
      case HTTP_METHOD.GET:
        if (pathname === USERS_URL) {
          return handleResponse(res, 200, userService.getAllUsers());
        } else if (pathname?.startsWith(USERS_URL+"/")) {
          if (!validateUserId(id)) {
            return handleResponse(res, 400, { error: "Invalid UUID format" });
          }
          return handleResponse(res, userService.getUserById(id!) ? 200 : 404, userService.getUserById(id!) || { error: "User doesnt exist" });
        }
        break;

      case HTTP_METHOD.POST:
        if (pathname === USERS_URL) {
          let body = "";
          req.on("data", (chunk) => (body += chunk));
          req.on("end", () => {
            const { username, age, hobbies } = JSON.parse(body);
            if (!username || typeof age !== "number" || !Array.isArray(hobbies)) {
              return handleResponse(res, 400, { error: "Provide all required fields" });
            }
            handleResponse(res, 201, userService.createUser({ username, age, hobbies }));
          });
          return;
        }
        break;

      case HTTP_METHOD.PUT:
        if (pathname?.startsWith(USERS_URL+"/")) {
          if (!validateUserId(id)) {
            return handleResponse(res, 400, { error: "Invalid UUID format" });
          }
          let body = "";
          req.on("data", (chunk) => (body += chunk));
          req.on("end", () => {
            const user = userService.updateUser(id!, JSON.parse(body));
            return handleResponse(res, user ? 200 : 404, user || { error: "User not found" });
          });
          return;
        }
        break;

      case HTTP_METHOD.DELETE:
        if (pathname?.startsWith(USERS_URL+"/")) {
          if (!validateUserId(id)) {
            return handleResponse(res, 400, { error: "Invalid UUID format" });
          }
          return handleResponse(res, userService.deleteUser(id!) ? 204 : 404, userService.deleteUser(id!) ? undefined : { error: "User not found or invalid UUID" });
        }
        break;
    }

    handleResponse(res, 404, { error: "Route not found" });
  } catch (error) {
    handleResponse(res, 500, { error: "Internal Server Error" });
  }
};
