import { useState } from "react";
import { Plus } from "lucide-react";

import SessionItem from "./SessionItem";
import type { Session } from "./SessionItem";

interface SidebarProps {
  isOpen: boolean;
  sessions: Session[];
  currentSessionId: number;
  onNewChat: () => void;
  onSelectSession: (sessionId: number) => void;
  onRenameSession: (sessionId: number, newTitle: string) => void;
  onDeleteSession: (sessionId: number) => void;
}

export default function Sidebar({
  isOpen,
  sessions,
  currentSessionId,
  onNewChat,
  onSelectSession,
  onRenameSession,
  onDeleteSession,
}: SidebarProps) {
  const [editingSessionId, setEditingSessionId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>("");
  const [showMenu, setShowMenu] = useState<number | null>(null);

  const handleRename = (sessionId: number, newTitle: string) => {
    onRenameSession(sessionId, newTitle);
    setEditingSessionId(null);
  };

  return (
    <div
      className={`${isOpen ? "w-64" : "w-0"} transition-all duration-300 text-white flex flex-col ${isOpen ? "overflow-y-auto" : "overflow-hidden"}`}
      style={{ backgroundColor: "#000000" }}
    >
      <div className="p-4 shrink-0" style={{ borderBottom: "1px solid #333" }}>
        <button
          onClick={onNewChat}
          className="w-full flex items-center gap-2 px-4 py-3 rounded-lg transition-colors whitespace-nowrap"
          style={{ backgroundColor: "#1a1a1a" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#2a2a2a")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#1a1a1a")
          }
        >
          <Plus size={20} />
          <span>New Chat</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 min-h-0">
        {sessions.map((session) => (
          <SessionItem
            key={session.id}
            session={session}
            isActive={currentSessionId === session.id}
            isEditing={editingSessionId === session.id}
            editingTitle={editingTitle}
            showMenu={showMenu === session.id}
            onSelect={() => onSelectSession(session.id)}
            onStartEdit={() => {
              setEditingSessionId(session.id);
              setEditingTitle(session.title);
              setShowMenu(null);
            }}
            onEditChange={setEditingTitle}
            onFinishEdit={() => handleRename(session.id, editingTitle)}
            onToggleMenu={() =>
              setShowMenu(showMenu === session.id ? null : session.id)
            }
            onDelete={() => {
              onDeleteSession(session.id);
              setShowMenu(null);
            }}
          />
        ))}
      </div>
    </div>
  );
}
