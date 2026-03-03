import { memo } from "react";
import { Code } from "lucide-react";

interface CodePanelProps {
  code: string;
  highlightedLines: number[];
  title?: string;
}

const CodePanel = memo(({ code, highlightedLines, title }: CodePanelProps) => {
  const lines = code.split("\n");

  return (
    <div className="glass rounded-lg overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border/50">
        <Code className="h-3.5 w-3.5 text-primary" />
        <span className="text-xs font-mono text-muted-foreground">{title || "Python"}</span>
        <span className="text-[10px] font-mono text-primary ml-auto">.py</span>
      </div>
      <div className="overflow-auto max-h-[400px] text-[12px] leading-[1.6]">
        <pre className="p-0 m-0">
          {lines.map((line, i) => {
            const isHighlighted = highlightedLines.includes(i);
            return (
              <div
                key={i}
                className={`flex transition-all duration-200 ${
                  isHighlighted
                    ? "bg-primary/15 border-l-2 border-primary"
                    : "border-l-2 border-transparent"
                }`}
              >
                <span
                  className={`select-none w-8 text-right pr-3 flex-shrink-0 font-mono ${
                    isHighlighted ? "text-primary" : "text-muted-foreground/40"
                  }`}
                >
                  {i + 1}
                </span>
                <code
                  className={`font-mono pr-4 whitespace-pre ${
                    isHighlighted ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {line || " "}
                </code>
              </div>
            );
          })}
        </pre>
      </div>
    </div>
  );
});

CodePanel.displayName = "CodePanel";

export default CodePanel;
