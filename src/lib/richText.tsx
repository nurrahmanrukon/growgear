import { ReactNode } from "react";

/** Renders admin-edited copy that may contain "**bold**" markers as React nodes —
 *  a lightweight convention so an admin can emphasize a word or phrase without a
 *  rich-text editor. */
export function renderWithBold(text: string, boldClassName?: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className={boldClassName}>
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    )
  );
}
