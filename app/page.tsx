import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageCirclePlus } from "lucide-react";

export default function Home() {
  const newChatId = crypto.randomUUID().slice(0, 12);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-blue-900 dark:from-black dark:to-black">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-4">Kimi AI</h1>
        <p className="text-xl text-white/80 mb-10">AI imut yang selalu siap ngobrol sama kamuu ♡</p>
        <Link href={`/chat/${newChatId}`}>
          <Button size="lg" className="gap-2">
            <MessageCirclePlus className="w-5 h-5" />
            Mulai Chat Baru
          </Button>
        </Link>
      </div>
    </div>
  );
}
