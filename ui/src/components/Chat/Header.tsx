import { Menu, X } from "lucide-react";

interface ChatHeaderProps {
  title: string | undefined;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export default function ChatHeader({
  title,
  sidebarOpen,
  onToggleSidebar,
}: ChatHeaderProps) {
  return (
    <div
      className="px-4 py-3 flex items-center gap-3"
      style={{
        backgroundColor: "#E2DDB4",
        borderBottom: "1px solid #d4cda0",
      }}
    >
      <button
        onClick={onToggleSidebar}
        className="p-2 rounded-lg"
        style={{ backgroundColor: "transparent" }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = "#d4cda0")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "transparent")
        }
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      <h1 className="text-lg font-semibold" style={{ color: "#000000" }}>
        {title || "New Chat"}
      </h1>
    </div>
  );
}
