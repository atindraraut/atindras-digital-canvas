import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import 'highlight.js/styles/github-dark.css';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
  return (
    <div className="prose prose-invert prose-lg max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-4xl font-bold text-gradient mb-8 pb-4 border-b border-border/50">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-3xl font-semibold text-foreground mb-6 mt-12">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-2xl font-semibold text-foreground mb-4 mt-8">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-muted-foreground leading-relaxed mb-6">
              {children}
            </p>
          ),
          code: ({ inline, children, className, ...props }: any) => {
            if (inline) {
              return (
                <code className="bg-secondary/50 text-primary px-2 py-1 rounded text-sm font-mono">
                  {children}
                </code>
              );
            }
            return (
              <code className={`${className} block bg-secondary/30 rounded-lg p-4 overflow-x-auto`} {...props}>
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="bg-secondary/30 rounded-lg p-4 overflow-x-auto mb-6 border border-border/50">
              {children}
            </pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary pl-6 italic text-muted-foreground bg-secondary/20 py-4 my-6 rounded-r-lg">
              {children}
            </blockquote>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6 ml-4">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground mb-6 ml-4">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-muted-foreground">
              {children}
            </li>
          ),
          a: ({ href, children }) => (
            <a 
              href={href} 
              className="text-primary hover:text-primary/80 underline smooth-transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          strong: ({ children }) => (
            <strong className="text-foreground font-semibold">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="text-foreground/90 italic">
              {children}
            </em>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;