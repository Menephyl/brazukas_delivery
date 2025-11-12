/**
 * Brazukas Delivery - ChatWidget Component
 * Widget de chat para suporte ao cliente
 */

import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  text: string;
  sender: "user" | "support";
  timestamp: string;
}

interface ChatWidgetProps {
  userId: string | number;
}

export default function ChatWidget({ userId }: ChatWidgetProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    setLoading(true);

    // Add user message
    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      text: input,
      sender: "user",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate support response
    setTimeout(() => {
      const supportMessage: Message = {
        id: `msg_${Date.now() + 1}`,
        text: "Obrigado pela sua mensagem! Um agente de suporte responderá em breve.",
        sender: "support",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, supportMessage]);
      setLoading(false);
    }, 1500);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 bg-primary text-primary-foreground rounded-full p-4 shadow-lg hover:shadow-xl transition-all hover:scale-110 z-40"
        title="Abrir chat de suporte"
      >
        <div className="relative">
          <MessageCircle className="h-6 w-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </div>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-2rem)] bg-background rounded-lg shadow-2xl flex flex-col z-50 animate-slide-up">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4 rounded-t-lg flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Suporte Brazukas</h3>
          <p className="text-sm opacity-90">Responderemos em breve</p>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="p-1 hover:bg-primary/80 rounded transition"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px] max-h-[400px]">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <MessageCircle className="h-12 w-12 mb-3 opacity-50" />
            <p className="text-sm">Olá! Como podemos ajudar?</p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-muted text-muted-foreground rounded-bl-none"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="border-t border-border p-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escreva sua mensagem..."
          disabled={loading}
          className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
        />
        <Button
          type="submit"
          disabled={loading || !input.trim()}
          size="sm"
          className="bg-primary hover:bg-primary/90"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    </div>
  );
}
