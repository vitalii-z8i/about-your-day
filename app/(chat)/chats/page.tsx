import { redirect } from "next/navigation";
import { randomUUID } from "crypto";

export default function NewChat() {
  redirect(`/chats/${randomUUID()}`);
}
