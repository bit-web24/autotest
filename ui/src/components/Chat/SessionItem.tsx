import { MessageSquare, MoreVertical, Edit2, Trash2 } from "lucide-react";
import type { Message } from "./MessageBubble";

export interface Session {
  id: number;
  title: string;
  messages: Message[];
  createdAt: Date;
}

interface SessionItemProps {
  session: Session;
  isActive: boolean;
  isEditing: boolean;
  editingTitle: string;
  showMenu: boolean;
  onSelect: () => void;
  onStartEdit: () => void;
  onEditChange: (value: string) => void;
  onFinishEdit: () => void;
  onToggleMenu: () => void;
  onDelete: () => void;
}

export default function SessionItem({
  session,
  isActive,
  isEditing,
  editingTitle,
  showMenu,
  onSelect,
  onStartEdit,
  onEditChange,
  onFinishEdit,
  onToggleMenu,
  onDelete,
}: SessionItemProps) {
  return (
    <div
      className="group relative mb-1 rounded-lg"
      style={{
        backgroundColor: isActive ? "#1a1a1a" : "transparent",
      }}
      onMouseEnter={(e) => {
        if (!isActive) e.currentTarget.style.backgroundColor = "#1a1a1a";
      }}
      onMouseLeave={(e) => {
        if (!isActive) e.currentTarget.style.backgroundColor = "transparent";
      }}
    >
      {isEditing ? (
        <input
          type="text"
          value={editingTitle}
          onChange={(e) => onEditChange(e.target.value)}
          onBlur={onFinishEdit}
          onKeyPress={(e) => e.key === "Enter" && onFinishEdit()}
          className="w-full px-3 py-2 rounded-lg text-sm outline-none"
          style={{ backgroundColor: "#2a2a2a", color: "#fff" }}
          autoFocus
        />
      ) : (
        <div
          onClick={onSelect}
          className="flex items-center gap-2 px-3 py-2 cursor-pointer"
        >
          <MessageSquare size={16} className="shrink-0" />
          <span className="flex-1 text-sm truncate">{session.title}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleMenu();
            }}
            className="opacity-0 group-hover:opacity-100 p-1 rounded"
            style={{ backgroundColor: "transparent" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#2a2a2a")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            <MoreVertical size={16} />
          </button>
        </div>
      )}

      {showMenu && (
        <div
          className="absolute right-0 top-full mt-1 rounded-lg shadow-lg z-10 w-40"
          style={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }}
        >
          <button
            onClick={onStartEdit}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm"
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#2a2a2a")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            <Edit2 size={14} />
            Rename
          </button>
          <button
            onClick={onDelete}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm"
            style={{ color: "#E43636" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#2a2a2a")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
