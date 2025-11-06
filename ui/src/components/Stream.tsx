import { fetchEventSource } from "@microsoft/fetch-event-source";
import { useState, useEffect, useRef } from "react";

export default function Stream() {
  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const chatId = "3d2ecb3e-bd24-4d60-bff4-008966689b73";
  const hasStartedRef = useRef(false);

  useEffect(() => {
    setIsStreaming(true);

    const fetch_data = async () => {
      if (hasStartedRef.current) return; // Prevents second run
      hasStartedRef.current = true;

      await fetchEventSource(
        `http://127.0.0.1:8000/api/v1/chats/${chatId}/events/stream`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
            Accept: "text/event-stream",
          },
          body: JSON.stringify({ input: "hello" }),
          onmessage(ev) {
            if (ev.data === "[START]") {
              setIsStreaming(true);
            } else if (ev.data === "[END]") {
              setIsStreaming(false);
            } else {
              setMessages((prev) => [...prev, JSON.parse(ev.data)]);
              console.log(ev.data);
            }
          },
          onerror(err) {
            console.error(err);
            setIsStreaming(false);
            throw err;
          },
          onclose() {
            setIsStreaming(false);
          },
        },
      );
    };

    fetch_data();
  }, []);

  return (
    <div>
      <h1>{isStreaming ? "Streaming...." : "Stream Complete"}</h1>
      {messages.map((message, index) => (
        <span key={index}>
          {(() => {
            if (message.name === "on_chat_model_stream") {
              return message.payload.chunk;
            }
            return "";
          })()}
        </span>
      ))}
    </div>
  );
}
