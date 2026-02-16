


import MarkdownRenderer from "./MarkdownRenderer";

interface BaseMessage {
  request: string;
}

export interface CreateMessage extends BaseMessage {
  response?: string | null;
}

export interface Message extends BaseMessage {
  _id: string | null;
  response: string | null;
  created_at: Date;
  updated_at: Date;
}

interface MessageBubbleProps {
  message: Message;
  isStreaming?: boolean;
  streamContent?: string;
}

export default function MessageBubble({
  message,
  isStreaming = false,
  streamContent = ''
}: MessageBubbleProps) {




  // Determine what content to display for the AI response
  const displayContent = isStreaming ? streamContent : message.response;
  const showResponse = (displayContent && displayContent.length > 0) || isStreaming;

  return (
    <div className="space-y-4">
      {/* User's request */}
      <div className="flex gap-3 justify-end">
        <div className="max-w-[80%] rounded-lg px-4 py-3 bg-blue-500 text-white">
          <p className="whitespace-pre-wrap text-sm">{message.request}</p>
        </div>
      </div>

      {/* AI's response */}
      {showResponse && (
        <div className="flex gap-3 justify-start">
          <div className="max-w-[80%] rounded-lg px-4 py-3 bg-white text-gray-800 border border-gray-200">
            <div className="text-sm">
              <MarkdownRenderer content={displayContent || ""} />

              {isStreaming && (
                <span className="inline-block w-2 h-4 ml-1 bg-gray-800 animate-pulse" />
              )}
            </div>
            {/* {!isStreaming && (
              <>
                <br />
                <ActivityList events={events} />
              </>
            )} */}
          </div>
        </div>
      )}
    </div>
  );
}
