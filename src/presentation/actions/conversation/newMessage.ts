import { IValidator } from "@/src/application/ports/system";
import { JwtUser } from "@/src/application/use-cases/user/user.types";
import { Conversation } from "@/src/domain/entities";
import { ValidationError } from "../../errors";

export default class NewMessage {
  constructor(
    private authenticateUser: {
      execute: (token: string) => Promise<JwtUser>;
    },
    private newMessageUseCase: {
      execute: (
        user: JwtUser,
        conversationId: string,
        message: string,
      ) => Promise<Conversation>;
    },
    private validator: IValidator<string>,
  ) {}

  async call(
    token: string,
    conversationId: string,
    message: string,
  ): Promise<Conversation> {
    const { data, errors } = this.validator.validate(message);

    if (errors.length > 0) {
      throw new ValidationError("Your data is invalid", errors);
    }

    const user = await this.authenticateUser.execute(token);
    return this.newMessageUseCase.execute(user, conversationId, data);
  }
}
