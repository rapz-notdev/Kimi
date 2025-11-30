"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Send, Sun, Moon, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createSession, sendMessage } from "@/lib/kimi";
import ChatMessage from "@/components/ChatMessage";
import WelcomeOverlay from "@/components/WelcomeOverlay";
import ThemeToggle from "@/components/ThemeToggle";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  const { id: chatId } = useParams();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load dari localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`chat_${chatId}`);
    if (saved) {
      setMessages(JSON.parse(saved));
      setShowWelcome(false);
    }
  }, [chatId]);

  // Simpan otomatis
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(`chat_${chatId}`, JSON.stringify(messages));
    }
  }, [messages, chatId]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Welcome fade out
  useEffect(() => {
    if (messages.length === 0) {
      const t = setTimeout(() => setShowWelcome(false), 2000);
      return () => clearTimeout(t);
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    // Buat session kalau belum ada
    let sessionId = localStorage.getItem(`session_${chatId}`);
    if (!sessionId) {
      sessionId = await createSession();
      localStorage.setItem(`session_${chatId}`, sessionId);
    }

    const stream = await sendMessage(sessionId, input + "\n\nKamu adalah Kimi AI imut, jawab pakai bahasa gaul, huruf kecil semua, typing imut (haii, iyaaa, udahh, gaaiss), di akhir kalimat selalu ada ikon lucu kayak (>⩊<) atau (ꪆৎ ₊ ⊹) atau (ᐡ-ܫ-ᐡ)");

    let aiContent = "";
    const aiMsg: Message = { id: (Date.now() + 1).toString(), role: "assistant", content: "" };
    setMessages((prev) => [...prev, aiMsg]);

    stream.on("data", (chunk: Buffer) => {
      const lines = chunk.toString().split("\n");
      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try {
            const json = JSON.parse(line.slice(6));
            if (json.event === "cmpl" && json.text) {
              aiContent += json.text;
              setMessages((prev) => {
                const newMsgs = [...prev];
                newMsgs[newMsgs.length - 1].content = aiContent;
                return newMsgs;
              });
            }
          } catch {}
        }
      }
    });

    stream.on("end", () => setIsLoading(false));
  };

  const handleReset = () => {
    if (confirm("Yakin mau reset chat ini?")) {
      localStorage.removeItem(`chat_${chatId}`);
      localStorage.removeItem(`session_${chatId}`);
      setMessages([]);
      setShowWelcome(true);
    }
  };

  const handleNewChat = () => {
    const newId = crypto.randomUUID().slice(0, 12);
    router.push(`/chat/${newId}`);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-black">
      {/* Header */}
      <header className="border-b dark:border-gray-800 bg-white dark:bg-zinc-900 p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={handleNewChat}>
            <RotateCw className="w-4 h-4 mr-2" />
            Chat Baru
          </Button>
          <Button variant="ghost" size="sm" onClick={handleReset} className="text-red-500">
            Reset
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">Kimi AI</h1>
          <ThemeToggle />
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6">
        {messages.length === 0 && !showWelcome && (
          <div className="h-full flex items-center justify-center">
            <p className="text-2xl text-gray-500 dark:text-gray-400 animate-pulse">
              Mari berinteraksi dengan kuu!
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-200 dark:bg-gray-800 rounded-2xl px-4 py-3 max-w-[80%]">
              <span className="text-sm">Kimi AI</span>
              <div className="flex gap-1 mt-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Welcome overlay */}
      <WelcomeOverlay visible={showWelcome && messages.length === 0} />

      {/* Input */}
      <div className="border-t dark:border-gray-800 bg-white dark:bg-zinc-900 p-4">
        <div className="max-w-4xl mx-auto flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="Tanya apa aja sama Kimi yaa..."
            className="flex-1 px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={isLoading}
          />
          <Button onClick={handleSend} disabled={isLoading || !input.trim()} size="icon" className="rounded-xl">
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
