import { useState } from "react";
import { Plus, MessageSquare, MoreVertical, Edit2, Trash2 } from "lucide-react";

// import SessionItem from "./SessionItem";
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
  const [editingTitle, setEditingTitle] = useState("");
  const [showMenu, setShowMenu] = useState<number | null>(null);

  const handleRename = (sessionId: number, newTitle: string) => {
    onRenameSession(sessionId, newTitle);
    setEditingSessionId(null);
  };

  return (
    <div
      className={`${isOpen ? "w-64" : "w-0"} transition-all duration-300 bg-white border-r border-gray-200 flex flex-col ${isOpen ? "overflow-y-auto" : "overflow-hidden"}`}
    >
      <div className="p-3 border-b border-gray-200">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors text-sm font-medium"
        >
          <Plus size={18} />
          <span>New Chat</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {sessions.map((session) => (
          <div
            key={session.id}
            className={`group relative mb-1 rounded-lg ${
              currentSessionId === session.id
                ? "bg-gray-100"
                : "hover:bg-gray-50"
            } transition-colors`}
          >
            {editingSessionId === session.id ? (
              <input
                type="text"
                value={editingTitle}
                onChange={(e) => setEditingTitle(e.target.value)}
                onBlur={() => handleRename(session.id, editingTitle)}
                onKeyPress={(e) =>
                  e.key === "Enter" && handleRename(session.id, editingTitle)
                }
                className="w-full px-3 py-2 rounded-lg text-sm outline-none border border-blue-500"
                autoFocus
              />
            ) : (
              <div
                onClick={() => onSelectSession(session.id)}
                className="flex items-center gap-2 px-3 py-2 cursor-pointer"
              >
                <MessageSquare size={16} className="shrink-0 text-gray-500" />
                <span className="flex-1 text-sm truncate text-gray-700">
                  {session.title}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(showMenu === session.id ? null : session.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-gray-200 transition-opacity"
                >
                  <MoreVertical size={16} className="text-gray-500" />
                </button>
              </div>
            )}

            {showMenu === session.id && (
              <div className="absolute right-0 top-full mt-1 rounded-lg shadow-lg z-10 w-40 bg-white border border-gray-200">
                <button
                  onClick={() => {
                    setEditingSessionId(session.id);
                    setEditingTitle(session.title);
                    setShowMenu(null);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Edit2 size={14} />
                  Rename
                </button>
                <button
                  onClick={() => {
                    onDeleteSession(session.id);
                    setShowMenu(null);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-gray-50"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
