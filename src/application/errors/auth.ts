import ApplicationError from "./application";

export default class AuthError extends ApplicationError {
  code: string = "AUTH_ERROR";
}
