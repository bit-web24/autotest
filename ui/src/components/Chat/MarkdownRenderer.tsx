import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import 'highlight.js/styles/github-dark.css';

interface MarkdownRendererProps {
    content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
    return (
        <div className="markdown-content">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight, rehypeRaw]}
                components={{
                    // Headings
                    h1: ({ node, ...props }) => (
                        <h1 className="text-2xl font-bold mt-6 mb-4 text-gray-900" {...props} />
                    ),
                    h2: ({ node, ...props }) => (
                        <h2 className="text-xl font-bold mt-5 mb-3 text-gray-900" {...props} />
                    ),
                    h3: ({ node, ...props }) => (
                        <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-900" {...props} />
                    ),
                    h4: ({ node, ...props }) => (
                        <h4 className="text-base font-semibold mt-3 mb-2 text-gray-800" {...props} />
                    ),
                    h5: ({ node, ...props }) => (
                        <h5 className="text-sm font-semibold mt-2 mb-1 text-gray-800" {...props} />
                    ),
                    h6: ({ node, ...props }) => (
                        <h6 className="text-xs font-semibold mt-2 mb-1 text-gray-700" {...props} />
                    ),

                    // Paragraphs
                    p: ({ node, ...props }) => (
                        <p className="mb-4 leading-relaxed text-gray-800" {...props} />
                    ),

                    // Lists
                    ul: ({ node, ...props }) => (
                        <ul className="list-disc list-inside mb-4 space-y-1 ml-4" {...props} />
                    ),
                    ol: ({ node, ...props }) => (
                        <ol className="list-decimal list-inside mb-4 space-y-1 ml-4" {...props} />
                    ),
                    li: ({ node, ...props }) => (
                        <li className="text-gray-800 leading-relaxed" {...props} />
                    ),

                    // Code blocks
                    code: ({ node, inline, className, children, ...props }: any) => {
                        if (inline) {
                            return (
                                <code
                                    className="bg-gray-100 text-red-600 px-1.5 py-0.5 rounded text-sm font-mono"
                                    {...props}
                                >
                                    {children}
                                </code>
                            );
                        }
                        return (
                            <code
                                className={`${className} block bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono my-3`}
                                {...props}
                            >
                                {children}
                            </code>
                        );
                    },

                    // Pre (for code blocks)
                    pre: ({ node, ...props }) => (
                        <pre className="my-3 overflow-x-auto" {...props} />
                    ),

                    // Blockquote
                    blockquote: ({ node, ...props }) => (
                        <blockquote
                            className="border-l-4 border-blue-500 pl-4 italic my-4 text-gray-700 bg-blue-50 py-2"
                            {...props}
                        />
                    ),

                    // Links
                    a: ({ node, ...props }) => (
                        <a
                            className="text-blue-600 hover:text-blue-800 underline"
                            target="_blank"
                            rel="noopener noreferrer"
                            {...props}
                        />
                    ),

                    // Tables
                    table: ({ node, ...props }) => (
                        <div className="overflow-x-auto my-4">
                            <table className="min-w-full border-collapse border border-gray-300" {...props} />
                        </div>
                    ),
                    thead: ({ node, ...props }) => (
                        <thead className="bg-gray-100" {...props} />
                    ),
                    tbody: ({ node, ...props }) => (
                        <tbody {...props} />
                    ),
                    tr: ({ node, ...props }) => (
                        <tr className="border-b border-gray-300" {...props} />
                    ),
                    th: ({ node, ...props }) => (
                        <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-800" {...props} />
                    ),
                    td: ({ node, ...props }) => (
                        <td className="border border-gray-300 px-4 py-2 text-gray-800" {...props} />
                    ),

                    // Horizontal rule
                    hr: ({ node, ...props }) => (
                        <hr className="my-6 border-t-2 border-gray-300" {...props} />
                    ),

                    // Images
                    img: ({ node, ...props }) => (
                        <img className="max-w-full h-auto rounded-lg my-4" {...props} />
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
