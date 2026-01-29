import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { cn } from "@/lib/utils";

type Props = {
  markdown: string;
  className?: string;
};

export default function MarkdownRenderer({ markdown, className }: Props) {
  return (
    <div
      className={cn(
        "prose prose-lg dark:prose-invert max-w-none",
        // Headings
        "prose-headings:font-bold prose-headings:tracking-tight",
        "prose-h1:text-3xl prose-h1:mt-8 prose-h1:mb-4",
        "prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:border-b prose-h2:border-border prose-h2:pb-2",
        "prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3",
        "prose-h4:text-lg prose-h4:mt-4 prose-h4:mb-2",
        // Paragraphs and text
        "prose-p:text-foreground/90 prose-p:leading-relaxed prose-p:mb-4",
        "prose-strong:text-foreground prose-strong:font-semibold",
        "prose-em:text-foreground/80",
        // Links
        "prose-a:text-primary prose-a:font-medium prose-a:no-underline hover:prose-a:underline prose-a:transition-colors",
        // Lists
        "prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6",
        "prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6",
        "prose-li:text-foreground/90 prose-li:mb-2 prose-li:leading-relaxed",
        // Blockquotes
        "prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-muted-foreground prose-blockquote:my-6",
        // Code
        "prose-code:bg-muted prose-code:text-primary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none",
        "prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:rounded-lg prose-pre:overflow-x-auto",
        // Tables
        "prose-table:w-full prose-table:my-6 prose-table:border-collapse",
        "prose-thead:border-b-2 prose-thead:border-border",
        "prose-th:text-left prose-th:p-3 prose-th:font-semibold prose-th:text-foreground prose-th:bg-muted/50",
        "prose-td:p-3 prose-td:border-b prose-td:border-border prose-td:text-foreground/90",
        "prose-tr:hover:bg-muted/30 prose-tr:transition-colors",
        // Images
        "prose-img:rounded-xl prose-img:shadow-lg prose-img:my-6",
        // Horizontal rule
        "prose-hr:border-border prose-hr:my-8",
        className
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
