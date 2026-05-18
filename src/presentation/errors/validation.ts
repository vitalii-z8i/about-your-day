import ApplicationError from "@/src/application/errors/application";

export default class ValidationError extends ApplicationError {
  code = "VALIDATION_ERROR";
  details?: { field: string; message: string }[];

  constructor(message: string, details?: { field: string; message: string }[]) {
    super(message);
    this.details = details;
  }
}
