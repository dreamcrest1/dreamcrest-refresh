import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

export function ExpandableText(props: {
  text: string;
  collapsedChars?: number;
  className?: string;
  moreLabel?: string;
  lessLabel?: string;
}) {
  const {
    text,
    collapsedChars = 220,
    className,
    moreLabel = "Read more",
    lessLabel = "Read less",
  } = props;

  const normalized = useMemo(() => {
    // Ensure literal \n and newlines don't show up as junk in UI.
    return (text ?? "")
      .replace(/\\n/g, " ")
      .replace(/[\r\n]+/g, " ")
      .replace(/\s{2,}/g, " ")
      .trim();
  }, [text]);

  const [expanded, setExpanded] = useState(false);

  const needsToggle = normalized.length > collapsedChars + 24;
  const shown = expanded || !needsToggle ? normalized : `${normalized.slice(0, collapsedChars).trimEnd()}…`;

  return (
    <div className={className}>
      <p className="text-lg text-muted-foreground">{shown}</p>
      {needsToggle && (
        <div className="mt-2">
          <Button
            type="button"
            variant="link"
            className="h-auto p-0 text-primary"
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? lessLabel : moreLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
