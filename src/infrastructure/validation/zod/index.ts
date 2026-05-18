import { z } from "zod";
import type { IValidator } from "@/src/application/ports/system";
import type { UserDTO, LoginUserDTO } from "@/src/application/use-cases/user/user.types";

type FieldError = { field: string; message: string };

function mapIssues(issues: z.ZodIssue[]): FieldError[] {
  return issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));
}

export class UserDTOValidator implements IValidator<UserDTO> {
  private schema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  });

  validate(data: UserDTO): { data: UserDTO; errors: FieldError[] } {
    const result = this.schema.safeParse(data);
    if (result.success) return { data: result.data as UserDTO, errors: [] };
    return { data, errors: mapIssues(result.error.issues) };
  }
}

export class LoginUserDTOValidator implements IValidator<LoginUserDTO> {
  private schema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
  });

  validate(data: LoginUserDTO): { data: LoginUserDTO; errors: FieldError[] } {
    const result = this.schema.safeParse(data);
    if (result.success) return { data: result.data as LoginUserDTO, errors: [] };
    return { data, errors: mapIssues(result.error.issues) };
  }
}

export class MessageValidator implements IValidator<string> {
  validate(data: string): { data: string; errors: FieldError[] } {
    if (!data?.trim()) {
      return { data, errors: [{ field: "", message: "Message cannot be empty" }] };
    }
    return { data: data.trim(), errors: [] };
  }
}
