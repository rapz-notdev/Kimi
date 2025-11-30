import { Bot, User } from "lucide-react";

export default function ChatMessage({ message }: { message: { role: "user" | "assistant"; content: string } }) {
  const isAI = message.role === "assistant";

  return (
    <div className={`flex ${isAI ? "justify-start" : "justify-end"} mb-4`}>
      <div className={`flex gap-3 max-w-[80%] ${isAI ? "" : "flex-row-reverse"}`}>
        <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${isAI ? "bg-purple-600" : "bg-blue-600"}`}>
          {isAI ? <Bot className="w-5 h-5 text-white" /> : <User className="w-5 h-5 text-white" />}
        </div>
        <div className={`rounded-2xl px-4 py-3 ${isAI ? "bg-gray-200 dark:bg-gray-800" : "bg-blue-600 text-white"}`}>
          {isAI && <p className="text-xs font-semibold mb-1 text-purple-600">Kimi AI</p>}
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    </div>
  );
}
