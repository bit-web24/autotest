import React, { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Brain,
  FileText,
  Code,
  Wrench,
  User,
  Database,
  Search,
  Zap,
  Clock,
} from "lucide-react";

// Event types
export type EventType =
  | "thinking"
  | "reading_file"
  | "writing_file"
  | "delegating"
  | "writing_code"
  | "calling_tool"
  | "searching"
  | "processing"
  | "waiting";

export interface ActivityEvent {
  id: string;
  type: EventType;
  title: string;
  output?: string; // Streaming output content
  isComplete?: boolean;
  timestamp?: Date;
}

interface ActivityIndicatorProps {
  event: ActivityEvent;
  isExpanded?: boolean;
  onToggle?: () => void;
}

// Icon mapping for different event types
const getEventIcon = (type: EventType) => {
  const iconMap = {
    thinking: Brain,
    reading_file: FileText,
    writing_file: Database,
    delegating: User,
    writing_code: Code,
    calling_tool: Wrench,
    searching: Search,
    processing: Zap,
    waiting: Clock,
  };
  return iconMap[type] || Brain;
};

// Activity Indicator Component (Expandable)
export default function ActivityIndicator({
  event,
  isExpanded: controlledExpanded,
  onToggle,
}: ActivityIndicatorProps) {
  const [internalExpanded, setInternalExpanded] = useState(false);

  const isExpanded =
    controlledExpanded !== undefined ? controlledExpanded : internalExpanded;
  const handleToggle =
    onToggle || (() => setInternalExpanded(!internalExpanded));

  const Icon = getEventIcon(event.type);
  const hasOutput = event.output && event.output.length > 0;

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      {/* Header - Always visible */}
      <button
        onClick={handleToggle}
        className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Status Indicator */}
          <div className="shrink-0">
            {event.isComplete ? (
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            ) : (
              <div className="w-5 h-5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
            )}
          </div>

          {/* Icon */}
          <div className="shrink-0 text-gray-600">
            <Icon size={18} />
          </div>

          {/* Title */}
          <span className="text-sm font-medium text-gray-900 truncate">
            {event.title}
          </span>

          {/* Timestamp */}
          {event.timestamp && (
            <span className="text-xs text-gray-400 ml-auto shrink-0">
              {event.timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
        </div>

        {/* Expand/Collapse Icon */}
        {hasOutput && (
          <div className="shrink-0 text-gray-400">
            {isExpanded ? (
              <ChevronDown size={18} />
            ) : (
              <ChevronRight size={18} />
            )}
          </div>
        )}
      </button>

      {/* Expandable Content - Output/Activity */}
      {isExpanded && hasOutput && (
        <div className="border-t border-gray-200 bg-gray-50">
          <div className="p-4">
            <div className="font-mono text-xs text-gray-700 whitespace-pre-wrap break-words">
              {event.output}
              {!event.isComplete && (
                <span className="inline-block w-2 h-4 bg-blue-500 animate-pulse ml-1" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Activity List Component - Shows multiple activities
interface ActivityListProps {
  events: ActivityEvent[];
}

export function ActivityList({ events }: ActivityListProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  if (events.length === 0) return null;

  return (
    <div className="space-y-2">
      {events.map((event) => (
        <ActivityIndicator
          key={event.id}
          event={event}
          isExpanded={expandedIds.has(event.id)}
          onToggle={() => toggleExpand(event.id)}
        />
      ))}
    </div>
  );
}

// Demo Component
export function Demo() {
  const [events, setEvents] = useState<ActivityEvent[]>([
    {
      id: "1",
      type: "thinking",
      title: "Analyzing request",
      output:
        "Parsing user query...\nIdentifying intent: code generation\nPlanning approach...",
      isComplete: true,
      timestamp: new Date(Date.now() - 5000),
    },
    {
      id: "2",
      type: "reading_file",
      title: "Reading package.json",
      output:
        '{\n  "name": "my-app",\n  "version": "1.0.0",\n  "dependencies": {\n    "react": "^18.2.0"\n  }\n}',
      isComplete: true,
      timestamp: new Date(Date.now() - 3000),
    },
    {
      id: "3",
      type: "writing_code",
      title: "Generating component",
      output:
        "import React from 'react';\n\nexport default function Button() {\n  return (\n    <button className=\"px-4 py-2\">\n      Click me\n    </button>\n  );\n}",
      isComplete: false,
      timestamp: new Date(),
    },
  ]);

  // Simulate streaming output
  React.useEffect(() => {
    const streamingEvent = events.find((e) => !e.isComplete);
    if (!streamingEvent) return;

    const chars = "\n\n// Adding styles...\nconst styles = { color: 'blue' };";
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < chars.length) {
        setEvents((prev) =>
          prev.map((e) =>
            e.id === streamingEvent.id
              ? { ...e, output: (e.output || "") + chars[currentIndex] }
              : e,
          ),
        );
        currentIndex++;
      } else {
        setEvents((prev) =>
          prev.map((e) =>
            e.id === streamingEvent.id ? { ...e, isComplete: true } : e,
          ),
        );
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [events]);

  const addNewActivity = () => {
    const newEvent: ActivityEvent = {
      id: Date.now().toString(),
      type: "calling_tool",
      title: "Calling web_search tool",
      output: "Executing search query...\n",
      isComplete: false,
      timestamp: new Date(),
    };
    setEvents([...events, newEvent]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold mb-2">
            Activity Indicator Component
          </h1>
          <p className="text-gray-600 text-sm">
            Expandable activity indicators with streaming output support
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Current Activities</h2>
            <button
              onClick={addNewActivity}
              className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
            >
              Add Activity
            </button>
          </div>

          <ActivityList events={events} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="font-semibold mb-3 text-sm">Usage Example:</h3>
          <pre className="text-xs bg-gray-50 p-4 rounded overflow-x-auto">
            {`import ActivityIndicator, { ActivityEvent } from "./ActivityIndicator";

const [events, setEvents] = useState<ActivityEvent[]>([{
  id: "1",
  type: "writing_code",
  title: "Generating component",
  output: "import React from 'react';\\n...",
  isComplete: false,
  timestamp: new Date(),
}]);

<ActivityList events={events} />`}
          </pre>
        </div>
      </div>
    </div>
  );
}

export { Demo as ActivityIndicatorDemo };
