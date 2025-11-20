import { useEffect, useState } from "react";
import { ActivityList } from "./ActivityIndicator";
import type { ActivityEvent } from "./ActivityIndicator";

interface BaseMessage {
  request: string;
}

export interface CreateMessage extends BaseMessage { }

export interface Message extends BaseMessage {
  _id: string | null;
  response: string | null;
  created_at: Date;
  updated_at: Date;
}

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  useEffect(() => {
    setEvents([
      {
        id: "1",
        type: "thinking",
        title: "Thinking...",
        output:
          "Parsing user query...\nIdentifying intent: code generation\nPlanning approach...",
        isComplete: false,
        timestamp: new Date(Date.now() - 5000),
      },
    ]);
  }, []);

  return (
    <>
      {/* User's request */}
      <div className="flex gap-3 justify-end">
        <div className="max-w-[80%] rounded-lg px-4 py-3 bg-blue-500 text-white">
          <p className="whitespace-pre-wrap text-sm">{message.request}</p>
        </div>
      </div>

      {/* AI's response */}
      {message.response && (
        <div className="flex gap-3 justify-start">
          <div className="max-w-[80%] rounded-lg px-4 py-3 bg-white text-gray-800 border border-gray-200">
            <p className="whitespace-pre-wrap text-sm">{message.response}</p>
            <br />
            <ActivityList events={events} />
          </div>
        </div>
      )}
    </>
  );
}
