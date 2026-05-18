import { IValidator } from "@/src/application/ports/system";
import { FieldError } from "./validator";

export class MessageValidator implements IValidator<string> {
  validate(data: string): { data: string; errors: FieldError[] } {
    if (!data?.trim()) {
      return {
        data,
        errors: [{ field: "", message: "Message cannot be empty" }],
      };
    }
    return { data: data.trim(), errors: [] };
  }
}
