import { MessageSquare, Loader2 } from "lucide-react";

import MessageBubble from "./MessageBubble";
import type { Message } from "./MessageBubble";
import { useEffect, useState } from "react";

interface MessagesAreaProps {
  sessionId: string | null;
  messages: string[];
  isLoading?: boolean;
}

const SERVER_BASE_URL = "http://localhost:8000";

export default function MessagesArea({ sessionId, messages, isLoading = false }: MessagesAreaProps) {
  const [messagesBody, setMessagesBody] = useState<Message[]>([]);

  useEffect(() => {
    // Reset messages when sessionId or messages array changes
    setMessagesBody([]);

    // If no messages, nothing to fetch
    if (messages.length === 0) {
      return;
    }

    // Fetch all messages in parallel while maintaining order
    Promise.all(
      messages.map((messageId) =>
        fetch(`${SERVER_BASE_URL}/api/v1/chats/${sessionId}/messages/${messageId}`, {
          method: "GET",
        }).then((response) => response.json())
      )
    )
      .then((fetchedMessages) => {
        setMessagesBody(fetchedMessages);
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
      });
  }, [sessionId, messages]);

  if (messages.length === 0 && !isLoading) {
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
      {messagesBody.map((message) => (
        <MessageBubble key={message._id} message={message} />
      ))}

      {isLoading && (
        <div className="flex gap-3 justify-start">
          <div className="max-w-[80%] rounded-lg px-4 py-3 bg-white text-gray-800 border border-gray-200">
            <div className="flex items-center gap-2">
              <Loader2 className="animate-spin" size={16} />
              <span className="text-sm text-gray-600">Processing your request...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
