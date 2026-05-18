import { IValidator } from "@/src/application/ports/system";
import { UserDTO } from "@/src/application/use-cases/user/user.types";
import { User } from "@/src/domain/entities";
import { ValidationError } from "../../errors";

export default class RegisterUser {
  constructor(
    protected registerUseCase: { execute: (data: UserDTO) => Promise<User> },
    protected validator: IValidator<UserDTO>,
  ) {}

  async call(request: Record<string, unknown>): Promise<User> {
    const { data, errors } = this.validator.validate(request as UserDTO);
    if (errors.length > 0) {
      throw new ValidationError("Your data is invalid", errors);
    }

    const user = await this.registerUseCase.execute(data);
    return user;
  }
}
