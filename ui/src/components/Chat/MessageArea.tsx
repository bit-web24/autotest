import { MessageSquare } from "lucide-react";

import MessageBubble from "./MessageBubble";
import type { Message } from "./MessageBubble";
import { useEffect, useState, useRef } from "react";

interface MessagesAreaProps {
  sessionId: string | null;
  messages: string[];
  streamingMessage?: Message | null;
  streamContent?: string;
  isStreaming?: boolean;
}

const SERVER_BASE_URL = "http://localhost:8000";

export default function MessagesArea({
  sessionId,
  messages,
  streamingMessage = null,
  streamContent = '',
  isStreaming = false
}: MessagesAreaProps) {
  const [messagesBody, setMessagesBody] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Autoscroll to bottom when messages change or streaming updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesBody, streamingMessage, streamContent, isStreaming]);

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

  if (messages.length === 0 && !streamingMessage) {
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

      {streamingMessage && (
        <MessageBubble
          key={streamingMessage._id}
          message={streamingMessage}
          isStreaming={isStreaming}
          streamContent={streamContent}
        />
      )}

      {/* Invisible div for autoscroll */}
      <div ref={messagesEndRef} />
    </div>
  );
}
