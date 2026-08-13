import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

interface MarkdownViewProps {
  content: string;
}

const components: Components = {
  h1: ({ children }) => (
    <h1 className="mt-2 font-display text-xl font-bold text-ink">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-3 font-display text-lg font-semibold text-ink">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-2 font-display text-base font-semibold text-ink">{children}</h3>
  ),
  p: ({ children }) => <p className="text-sm leading-relaxed text-ink/85">{children}</p>,
  a: ({ children, href }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="font-medium text-accent underline underline-offset-2 hover:text-primary"
    >
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="ml-1 flex list-disc flex-col gap-1 pl-4 text-sm text-ink/85 marker:text-muted">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="ml-1 flex list-decimal flex-col gap-1 pl-4 text-sm text-ink/85 marker:text-muted">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold text-ink">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-primary pl-3 text-sm italic text-muted">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="border-line" />,
  code: ({ className, children }) => {
    const isBlock = /language-/.test(className ?? "");
    if (isBlock) {
      return <code className="font-mono text-xs leading-relaxed text-ink">{children}</code>;
    }
    return (
      <code className="rounded bg-elevate px-1.5 py-0.5 font-mono text-[0.85em] text-accent">
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="overflow-x-auto rounded-xl border border-line bg-canvas p-3">{children}</pre>
  ),
};

function MarkdownView({ content }: MarkdownViewProps) {
  return (
    <div className="flex flex-col gap-2">
      <Markdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </Markdown>
    </div>
  );
}

export default MarkdownView;
