import { useState } from "react";
import { Link2, Check } from "lucide-react";
import { toast } from "sonner";

export function CopyTradeLink({ tradeId }: { tradeId: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    const url = `${window.location.origin}/history?trade=${encodeURIComponent(tradeId)}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Trade link copied.");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy link in this browser.");
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-win" /> : <Link2 className="h-3.5 w-3.5" />}
      {copied ? "Copied" : "Copy link"}
    </button>
  );
}
