import { IValidator } from "@/src/application/ports/system";
import { LoginUserDTO } from "@/src/application/use-cases/user/user.types";
import { ValidationError } from "../../errors";

export default class LoginUser {
  constructor(
    protected loginUseCase: { execute: (data: LoginUserDTO) => Promise<string> },
    protected validator: IValidator<LoginUserDTO>,
  ) {}

  async call(request: Record<string, unknown>): Promise<string> {
    const { data, errors } = this.validator.validate(request as LoginUserDTO);
    if (errors.length > 0) {
      throw new ValidationError("Your data is invalid", errors);
    }

    return this.loginUseCase.execute(data);
  }
}
