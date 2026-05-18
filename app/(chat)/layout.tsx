import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { container } from "@/src/infrastructure/composition/container";
import Sidebar from "@/components/chat/sidebar";

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const conversations = await container.conversation.list().execute(user.id);

  return (
    <div className="flex h-screen bg-stone-100">
      <aside
        className="shrink-0 bg-white border-r border-stone-200 flex flex-col"
        style={{ width: 260 }}
      >
        <div className="px-4 pt-5 pb-3">
          <h1 className="text-center font-medium text-stone-900">
            About Your <span className="text-[#4a6741] font-bold">Day</span>
          </h1>
        </div>
        <Sidebar conversations={conversations} />
      </aside>

      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
