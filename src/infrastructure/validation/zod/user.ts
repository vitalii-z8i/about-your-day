import { IValidator } from "@/src/application/ports/system";
import ZodValidator from "./validator";
import { z } from "zod";
import type {
  UserDTO,
  LoginUserDTO,
} from "@/src/application/use-cases/user/user.types";

export class UserDTOValidator
  extends ZodValidator<UserDTO>
  implements IValidator<UserDTO>
{
  schema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  });
}

export class LoginUserDTOValidator
  extends ZodValidator<LoginUserDTO>
  implements IValidator<LoginUserDTO>
{
  protected schema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
  });
}
