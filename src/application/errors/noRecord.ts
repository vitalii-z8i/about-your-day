import ApplicationError from "./application";

export default class NoRecordError extends ApplicationError {
  code: string = "NO_RECORD";
}
