"use client";

import { motion } from "motion/react";
import { CheckCircle } from "@phosphor-icons/react";
import { displayName } from "@/lib/names";
import type { Rec } from "@/types";

interface RecCardProps {
  rec: Rec;
  onMarkRead: (id: string) => void;
}

export function RecCard({ rec, onMarkRead }: RecCardProps) {
  return (
    <motion.div
      className="relative rounded-xl bg-surface-elevated border border-amber/20 p-4"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      style={{
        boxShadow: "0 1px 3px rgba(232,168,80,0.08), 0 4px 12px rgba(232,168,80,0.04)",
      }}
    >
      {/* Read state overlay */}
      {rec.read && (
        <div className="absolute inset-0 bg-surface/60 rounded-xl flex items-center justify-center backdrop-blur-[1px]">
          <span className="text-xs font-medium text-text-secondary flex items-center gap-1">
            <CheckCircle size={14} weight="fill" className="text-accent" />
            Read
          </span>
        </div>
      )}

      <div className="space-y-2">
        {/* From */}
        <p className="text-[10px] font-medium uppercase tracking-wider text-amber">
          From {displayName(rec.from)}
        </p>

        {/* Book */}
        <div>
          <h4 className="text-sm font-semibold text-text-primary leading-snug">
            {rec.bookTitle}
          </h4>
          <p className="text-xs text-text-secondary">{rec.bookAuthor}</p>
        </div>

        {/* Note */}
        {rec.note && (
          <p className="text-xs text-text-secondary leading-relaxed italic">
            &ldquo;{rec.note}&rdquo;
          </p>
        )}

        {/* Mark as read */}
        {!rec.read && (
          <button
            onClick={() => onMarkRead(rec.id)}
            className="text-[11px] font-medium text-accent hover:text-accent-hover transition-colors"
          >
            Mark as read
          </button>
        )}
      </div>
    </motion.div>
  );
}
