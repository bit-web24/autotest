import { useState, useEffect } from "react";

import Sidebar from "./Chat/Sidebar";
import ChatHeader from "./Chat/Header";
import MessagesArea from "./Chat/MessageArea";
import InputArea from "./Chat/InputArea";
import type { Message, CreateMessage } from "./Chat/MessageBubble";

const SERVER_BASE_URL = "http://localhost:8000";

export interface Session {
  _id: string;
  name: string;
  messages: Message[];
  created_at: Date;
  updated_at: Date;
}

export default function Chat() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const currentSession = sessions.find((s) => s._id === currentSessionId);

  // Load sessions on mount
  useEffect(() => {
    setIsLoading(true);
    fetch(`${SERVER_BASE_URL}/api/v1/chats`)
      .then((response) => response.json())
      .then((data) => {
        setSessions(data);
        // Set the first session as current, or create a new one if empty
        if (data.length > 0) {
          setCurrentSessionId(data[0]._id);
          setIsLoading(false);
        } else {
          // Create initial session if none exist
          const initialSession = {
            name: "New Chat",
          };

          fetch(`${SERVER_BASE_URL}/api/v1/chats`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(initialSession),
          })
            .then((response) => response.json())
            .then((session) => {
              setSessions([session]);
              setCurrentSessionId(session._id);
              setIsLoading(false);
            })
            .catch((error) => {
              console.error("Error creating initial session:", error);
              setError("Failed to create initial session");
              setIsLoading(false);
            });
        }
      })
      .catch((error) => {
        console.error("Error loading sessions:", error);
        setError("Failed to load chat sessions");
        setIsLoading(false);
      });
  }, []);

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !currentSessionId) return;

    const userRequest = inputMessage;
    setInputMessage("");

    // Optimistic UI update - add message immediately with temporary ID
    const tempMessage: Message = {
      _id: `temp-${Date.now()}`,
      request: userRequest,
      response: null,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const optimisticSession = {
      ...currentSession!,
      messages: [...currentSession!.messages, tempMessage],
    };
    setSessions(
      sessions.map((s) =>
        s._id === currentSessionId ? optimisticSession : s,
      ),
    );

    const newMessage: CreateMessage = {
      request: userRequest,
    };

    fetch(`${SERVER_BASE_URL}/api/v1/chats/${currentSessionId}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newMessage),
    })
      .then((response) => response.json())
      .then((message) => {
        // Replace temp message with real one from server
        const updatedSession = {
          ...currentSession!,
          messages: [
            ...currentSession!.messages.filter((m) => m._id !== tempMessage._id),
            message,
          ],
        };
        setSessions(
          sessions.map((s) =>
            s._id === currentSessionId ? updatedSession : s,
          ),
        );
      })
      .catch((error) => {
        console.error("Error sending message:", error);
        setError("Failed to send message");
        // Revert optimistic update on error
        const revertedSession = {
          ...currentSession!,
          messages: currentSession!.messages.filter((m) => m._id !== tempMessage._id),
        };
        setSessions(
          sessions.map((s) =>
            s._id === currentSessionId ? revertedSession : s,
          ),
        );
      });
  };

  const handleNewChat = () => {
    const data = {
      name: "New Chat",
    };

    fetch(`${SERVER_BASE_URL}/api/v1/chats`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((session) => {
        setSessions([session, ...sessions]);
        setCurrentSessionId(session._id);
      })
      .catch((error) => {
        console.error("Error creating session:", error);
      });
  };

  const handleDeleteSession = (sessionId: string) => {
    fetch(`${SERVER_BASE_URL}/api/v1/chats/${sessionId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then(() => {
        const updatedSessions = sessions.filter((s) => s._id !== sessionId);
        setSessions(updatedSessions);
        if (currentSessionId === sessionId) {
          // Set to the first remaining session, or null if none remain
          setCurrentSessionId(updatedSessions.length > 0 ? updatedSessions[0]._id : null);
        }
      })
      .catch((error) => {
        console.error("Error deleting session:", error);
        setError("Failed to delete session");
      });
  };

  const handleRenameSession = (sessionId: string, newTitle: string) => {
    fetch(`${SERVER_BASE_URL}/api/v1/chats/${sessionId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: newTitle }),
    })
      .then((response) => response.json())
      .then((session) => {
        setSessions(
          sessions.map((s) => (s._id === sessionId ? session : s)),
        );
      })
      .catch((error) => {
        console.error("Error renaming session:", error);
      });
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-100 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading chats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Error notification */}
      {error && (
        <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-4 font-bold hover:text-gray-200"
          >
            ×
          </button>
        </div>
      )}

      <Sidebar
        isOpen={sidebarOpen}
        sessions={sessions}
        currentSessionId={currentSessionId}
        onNewChat={handleNewChat}
        onSelectSession={setCurrentSessionId}
        onRenameSession={handleRenameSession}
        onDeleteSession={handleDeleteSession}
      />

      <div className="flex-1 flex flex-col">
        <ChatHeader
          title={currentSession?.name}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <div className="flex-1 overflow-y-auto px-4 py-6">
          <MessagesArea messages={currentSession?.messages || []} />
        </div>

        <InputArea
          value={inputMessage}
          onChange={setInputMessage}
          onSend={handleSendMessage}
        />
      </div>
    </div>
  );
}
