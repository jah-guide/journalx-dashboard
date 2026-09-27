import { useEffect, useRef } from "react";

export type KeyboardShortcut = {
  key: string;
  handler: () => void;
  mod?: boolean;
  shift?: boolean;
  allowInInput?: boolean;
  when?: () => boolean;
};

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target.isContentEditable;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  const shortcutsRef = useRef(shortcuts);
  shortcutsRef.current = shortcuts;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const typing = isTypingTarget(event.target);
      for (const shortcut of shortcutsRef.current) {
        if (!shortcut.allowInInput && typing) continue;
        if (shortcut.when && !shortcut.when()) continue;

        const modHeld = event.metaKey || event.ctrlKey;
        if (shortcut.mod && !modHeld) continue;
        if (!shortcut.mod && modHeld && shortcut.key.length === 1) continue;
        if (shortcut.shift && !event.shiftKey) continue;
        if (!shortcut.shift && event.shiftKey && shortcut.key !== "?") continue;

        if (event.key.toLowerCase() !== shortcut.key.toLowerCase()) continue;

        event.preventDefault();
        shortcut.handler();
        return;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
}
