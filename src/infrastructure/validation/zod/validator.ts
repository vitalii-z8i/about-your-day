import { IValidator } from "@/src/application/ports/system";
import z from "zod";

export type FieldError = { field: string; message: string };

export default abstract class ZodValidator<T> implements IValidator<T> {
  protected abstract readonly schema: z.ZodSchema<T>;

  validate(data: T): { data: T; errors: FieldError[] } {
    const result = this.schema.safeParse(data);
    if (result.success) return { data: result.data as T, errors: [] };
    return { data, errors: this.mapIssues(result.error.issues) };
  }

  private mapIssues(issues: z.ZodIssue[]): FieldError[] {
    return issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
  }
}
