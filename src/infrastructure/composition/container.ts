import { MongoUserRepository } from "@/src/infrastructure/data-access/mongo/user";
import { MongoConversationRepository } from "@/src/infrastructure/data-access/mongo/conversation";
import { MockTokenService } from "@/src/infrastructure/services/mock/token";
import { MockEncryptionService } from "@/src/infrastructure/services/mock/encryption";
import { MockAiService } from "@/src/infrastructure/services/mock/ai";
import { MockIdService } from "@/src/infrastructure/services/mock/id";

import RegisterUser from "@/src/application/use-cases/user/register";
import LoginUser from "@/src/application/use-cases/user/login";
import AuthenticateUser from "@/src/application/use-cases/user/authenticate";
import ListConversations from "@/src/application/use-cases/conversation/list";
import FindConversation from "@/src/application/use-cases/conversation/find";
import AddMessage from "@/src/application/use-cases/conversation/addMessage";
import RespondToMessage from "@/src/application/use-cases/conversation/respondToMessage";

import {
  UserDTOValidator,
  LoginUserDTOValidator,
  MessageValidator,
} from "@/src/infrastructure/validation/zod";
import {
  LoginUser as LoginUserAction,
  RegisterUser as RegisterUserAction,
} from "@/src/presentation/actions/auth";
import NewMessageAction from "@/src/presentation/actions/conversation/newMessage";
import RespondToMessageAction from "@/src/presentation/actions/conversation/respondToMessage";

/* Data Access */
const userRepo = new MongoUserRepository();
const convRepo = new MongoConversationRepository();

/* Services */
const tokenService = new MockTokenService();
const encryptionService = new MockEncryptionService();
const aiService = new MockAiService();
const idService = new MockIdService();

/* Validators */
const userDTOValidator = new UserDTOValidator();
const loginUserDTOValidator = new LoginUserDTOValidator();
const messageValidator = new MessageValidator();

export const container = {
  user: {
    register: () => new RegisterUser(userRepo, encryptionService),
    login: () => new LoginUser(userRepo, encryptionService, tokenService),
    authenticate: () => new AuthenticateUser(tokenService, userRepo),
  },
  conversation: {
    list: () => new ListConversations(convRepo),
    find: () => new FindConversation(convRepo),
    addMessage: () => new AddMessage(convRepo, idService, aiService as never),
    respondToMessage: () =>
      new RespondToMessage(convRepo, idService, aiService as never),
  },
  actions: {
    auth: {
      register: () =>
        new RegisterUserAction(
          new RegisterUser(userRepo, encryptionService),
          userDTOValidator,
        ),
      login: () =>
        new LoginUserAction(
          new LoginUser(userRepo, encryptionService, tokenService),
          loginUserDTOValidator,
        ),
    },
    conversation: {
      newMessage: () =>
        new NewMessageAction(
          new AuthenticateUser(tokenService, userRepo),
          new AddMessage(convRepo, idService, aiService as never),
          messageValidator,
        ),
      respondToMessage: () =>
        new RespondToMessageAction(
          new FindConversation(convRepo),
          new RespondToMessage(convRepo, idService, aiService as never),
        ),
    },
  },
};
