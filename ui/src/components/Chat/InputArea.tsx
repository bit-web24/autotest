import { Send } from "lucide-react";

interface InputAreaProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
}

export default function InputArea({ value, onChange, onSend }: InputAreaProps) {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white px-4 py-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex gap-3 items-end">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            rows={1}
            className="flex-1 resize-none rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            style={{ maxHeight: "200px" }}
          />
          <button
            onClick={onSend}
            disabled={!value.trim()}
            className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
