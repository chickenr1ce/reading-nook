"use client";

import { useEffect } from "react";
import { ArrowClockwise, WarningCircle } from "@phosphor-icons/react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Uncaught application error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-14 h-14 rounded-full bg-accent/10 text-accent flex items-center justify-center mb-4">
        <WarningCircle size={28} weight="bold" />
      </div>
      <h2 className="text-xl font-bold text-text-primary mb-2">
        Something went wrong
      </h2>
      <p className="text-sm text-text-secondary max-w-md mb-6 leading-relaxed">
        The Reading Nook encountered an unexpected error. If this is a new deployment, check that your Upstash Redis environment variables are configured in Vercel.
      </p>
      <div className="flex items-center gap-3">
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent text-cream-warm text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <ArrowClockwise size={16} weight="bold" />
          Try again
        </button>
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2.5 rounded-full bg-border/40 text-text-secondary hover:text-text-primary text-sm font-medium transition-colors"
        >
          Reload page
        </button>
      </div>
    </div>
  );
}
