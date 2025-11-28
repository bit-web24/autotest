import { useState, useCallback, useRef } from 'react';
import { flushSync } from 'react-dom';

const SERVER_BASE_URL = "http://localhost:8000";

export interface SSEEvent {
    event: string;
    data: any;
}

export interface StreamState {
    content: string;
    reasoning: string;
    isStreaming: boolean;
    error: string | null;
    threadId: string | null;
}

export function useSSEStream() {
    const [streamState, setStreamState] = useState<StreamState>({
        content: '',
        reasoning: '',
        isStreaming: false,
        error: null,
        threadId: null,
    });

    const abortControllerRef = useRef<AbortController | null>(null);

    const parseSSEMessage = (message: string): SSEEvent | null => {
        const lines = message.split('\n');
        let eventType = 'message';
        let data = '';

        for (const line of lines) {
            if (line.startsWith('event:')) {
                eventType = line.substring(6).trim();
            } else if (line.startsWith('data:')) {
                data = line.substring(5).trim();
            }
        }

        if (!data) return null;

        try {
            return {
                event: eventType,
                data: data === '[START]' || data === '[END]' ? data : JSON.parse(data),
            };
        } catch (e) {
            console.error('Failed to parse SSE data:', e);
            return null;
        }
    };

    const startStream = useCallback(
        async (
            chatId: string,
            userInput: string,
            onComplete?: (content: string) => void
        ) => {
            // Reset state
            setStreamState({
                content: '',
                reasoning: '',
                isStreaming: true,
                error: null,
                threadId: null,
            });

            // Create new abort controller
            abortControllerRef.current = new AbortController();

            try {
                const response = await fetch(
                    `${SERVER_BASE_URL}/api/v1/chats/${chatId}/events/stream`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ input: userInput }),
                        signal: abortControllerRef.current.signal,
                    }
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const reader = response.body?.getReader();
                const decoder = new TextDecoder();

                if (!reader) {
                    throw new Error('Response body is null');
                }

                let buffer = '';
                let accumulatedContent = '';
                let accumulatedReasoning = '';
                let currentThreadId: string | null = null;

                while (true) {
                    const { done, value } = await reader.read();

                    if (done) {
                        break;
                    }

                    buffer += decoder.decode(value, { stream: true });
                    const messages = buffer.split('\n\n');
                    buffer = messages.pop() || '';

                    for (const message of messages) {
                        if (!message.trim()) continue;

                        console.log('[SSE] Raw message:', message);
                        const event = parseSSEMessage(message);
                        if (!event) {
                            console.log('[SSE] Failed to parse event');
                            continue;
                        }

                        console.log('[SSE] Parsed event:', event);

                        switch (event.event) {
                            case 'begin':
                                console.log('[SSE] Stream started');
                                break;

                            case 'chunk':
                                const { name, payload } = event.data;
                                console.log('[SSE] Chunk received:', { name, payload });

                                if (payload?.thread_id) {
                                    currentThreadId = payload.thread_id;
                                }

                                if (name === 'on_chat_model_stream' && payload?.chunk) {
                                    if (payload.reasoning) {
                                        accumulatedReasoning += payload.chunk;
                                        console.log('[SSE] Reasoning chunk:', payload.chunk);
                                    } else {
                                        accumulatedContent += payload.chunk;
                                        console.log('[SSE] Content chunk:', payload.chunk);
                                    }

                                    // Use flushSync to force immediate rendering for smooth streaming
                                    flushSync(() => {
                                        setStreamState((prev) => ({
                                            ...prev,
                                            content: accumulatedContent,
                                            reasoning: accumulatedReasoning,
                                            threadId: currentThreadId,
                                        }));
                                    });
                                }
                                break;

                            case 'done':
                                console.log('[SSE] Stream completed');
                                setStreamState((prev) => ({
                                    ...prev,
                                    isStreaming: false,
                                }));

                                // Call completion callback
                                if (onComplete) {
                                    onComplete(accumulatedContent);
                                }
                                break;

                            case 'error':
                                console.error('[SSE] Stream error:', event.data);
                                setStreamState((prev) => ({
                                    ...prev,
                                    isStreaming: false,
                                    error: event.data.message || 'Unknown error occurred',
                                }));
                                break;

                            default:
                                console.log('[SSE] Unknown event type:', event.event);
                        }
                    }
                }
            } catch (error: any) {
                if (error.name === 'AbortError') {
                    console.log('Stream aborted');
                } else {
                    console.error('Stream error:', error);
                    setStreamState((prev) => ({
                        ...prev,
                        isStreaming: false,
                        error: error.message || 'Failed to connect to stream',
                    }));
                }
            }
        },
        []
    );

    const stopStream = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
        setStreamState((prev) => ({
            ...prev,
            isStreaming: false,
        }));
    }, []);

    return {
        streamState,
        startStream,
        stopStream,
    };
}
