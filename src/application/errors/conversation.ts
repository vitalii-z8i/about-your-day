import ApplicationError from "./application";

export default class ConversationError extends ApplicationError {
  code = "CONVERSATION_ERROR";
}
