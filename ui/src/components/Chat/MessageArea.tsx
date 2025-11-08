import { MessageSquare } from "lucide-react";

import MessageBubble from "./MessageBubble";
import type { Message } from "./MessageBubble";

interface MessagesAreaProps {
  messages: Message[];
}

export default function MessagesArea({ messages }: MessagesAreaProps) {
  if (messages.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        <div className="text-center">
          <MessageSquare size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-base">Start a new conversation</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
    </div>
  );
}
