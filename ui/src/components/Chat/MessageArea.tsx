import { useRef, useEffect } from "react";
import { MessageSquare } from "lucide-react";

import MessageBubble from "./MessageBubble";
import type { Message } from "./MessageBubble";

interface MessageAreaProps {
  messages: Message[];
}

export default function MessagesArea({ messages }: MessageAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        <div className="text-center">
          <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg">Start a new conversation</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
