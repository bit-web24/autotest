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
    <div className="px-4 py-3 bg-white border-b border-gray-200 flex items-center gap-3">
      <button
        onClick={onToggleSidebar}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        {sidebarOpen ? (
          <X size={20} className="text-gray-600" />
        ) : (
          <Menu size={20} className="text-gray-600" />
        )}
      </button>
      <h1 className="text-lg font-semibold text-gray-900">
        {title || "New Chat"}
      </h1>
    </div>
  );
}
