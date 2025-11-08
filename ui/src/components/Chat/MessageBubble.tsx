import { useEffect, useState } from "react";
import { ActivityList } from "./ActivityIndicator";
import type { ActivityEvent } from "./ActivityIndicator";

export interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
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
    <div
      className={`flex gap-3 ${
        message.sender === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[80%] rounded-lg px-4 py-3 ${
          message.sender === "user"
            ? "bg-blue-500 text-white"
            : "bg-white text-gray-800 border border-gray-200"
        }`}
      >
        <p className="whitespace-pre-wrap text-sm">{message.text}</p>
        {message.sender === "ai" ? (
          <>
            {" "}
            <br /> <ActivityList events={events} />{" "}
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
