import { MockUserRepository } from "@/src/infrastructure/data-access/mock/user";
import { MockConversationRepository } from "@/src/infrastructure/data-access/mock/conversation";
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

const userRepo = new MockUserRepository();
const convRepo = new MockConversationRepository();
const tokenService = new MockTokenService();
const encryptionService = new MockEncryptionService();
const aiService = new MockAiService();
const idService = new MockIdService();

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
    respondToMessage: () => new RespondToMessage(convRepo, idService, aiService as never),
  },
};
