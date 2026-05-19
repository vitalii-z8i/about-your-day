import ApplicationError from "./application";

export default class ExternalError extends ApplicationError {
  readonly code = "EXTERNAL_ERROR";
}
