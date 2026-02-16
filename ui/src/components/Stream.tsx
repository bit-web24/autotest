import { fetchEventSource } from "@microsoft/fetch-event-source";
import { useState, useEffect, useRef } from "react";

export default function Stream() {
  const [messages, setMessages] = useState<string[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const chatId = "3d2ecb3e-bd24-4d60-bff4-008966689b73";
  const hasStartedRef = useRef(false);

  useEffect(() => {
    const fetch_data = async () => {
      if (hasStartedRef.current) return;
      hasStartedRef.current = true;
      setIsStreaming(true);

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
          onopen(res) {
            if (res.ok && res.status === 200) {
              console.log("Connection established");
            } else if (
              res.status >= 400 &&
              res.status < 500 &&
              res.status !== 429
            ) {
              console.log("Client side error ", res);
            }
            return Promise.resolve();
          },
          onmessage(ev) {
            console.log(ev);
            switch (ev.event) {
              case "begin":
                setIsStreaming(true);
                break;
              case "done":
                setIsStreaming(false);
                break;
              case "chunk": {
                const data = JSON.parse(ev.data);
                if (data.payload?.chunk) {
                  setMessages((prev) => [...prev, data.payload.chunk]);
                }
                break;
              }
              case "error":
                console.error(ev.data);
                setIsStreaming(false);
                break;
            }
          },
          onclose() {
            console.log("Connection closed by the server");
            setIsStreaming(false);
          },
          onerror(err) {
            console.log("There was an error from server", err);
          },
        }
      );
    };

    fetch_data();
  }, []);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        {isStreaming ? "Streaming..." : "Stream Complete"}
      </h1>
      <div className="bg-gray-100 p-4 rounded-lg whitespace-pre-wrap">
        {messages.join("")}
      </div>
    </div>
  );
}
