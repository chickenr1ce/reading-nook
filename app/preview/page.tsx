"use client";

import { BookOpen } from "@phosphor-icons/react";

/* ── Aesthetic definitions ── */
interface Aesthetic {
  id: string;
  name: string;
  description: string;
  palette: { name: string; hex: string }[];
  cssVars: Record<string, string>;
}

const aesthetics: Aesthetic[] = [
  {
    id: "keep-forest",
    name: "Forest Cottage",
    description:
      "Warm cream walls, oak shelving, forest green accents, and a glowing amber hearth. Earthy, grounded, already built.",
    palette: [
      { name: "Cream", hex: "#faf7f0" },
      { name: "Forest", hex: "#3d6b4f" },
      { name: "Oak", hex: "#c4946c" },
      { name: "Amber", hex: "#e8a850" },
      { name: "Ink", hex: "#2c241b" },
    ],
    cssVars: {
      "--bg": "#faf7f0",
      "--surface": "#fffdf7",
      "--accent": "#3d6b4f",
      "--accent-soft": "#7ba88a",
      "--glow": "#e8a850",
      "--wood": "#c4946c",
      "--text": "#2c241b",
      "--text-muted": "#6b5e4e",
      "--border": "#e8e0d4",
    },
  },
  {
    id: "starlight",
    name: "Starlight Library",
    description:
      "Deep midnight indigo, scattered gold stars, moon-silver accents, and floating candlelight motes. A wizard's library after dark.",
    palette: [
      { name: "Midnight", hex: "#1a1a2e" },
      { name: "Star gold", hex: "#e8c547" },
      { name: "Moon", hex: "#c4c8d4" },
      { name: "Violet", hex: "#6b5b95" },
      { name: "Candle", hex: "#f0d9a0" },
    ],
    cssVars: {
      "--bg": "#1a1a2e",
      "--surface": "#222240",
      "--accent": "#6b5b95",
      "--accent-soft": "#9b8ec4",
      "--glow": "#e8c547",
      "--wood": "#3a2a50",
      "--text": "#e8e4f0",
      "--text-muted": "#a09ab8",
      "--border": "#2e2e4a",
    },
  },
  {
    id: "parchment",
    name: "Parchment & Ink",
    description:
      "Aged paper tones, deep navy ink, worn leather bindings, and vintage bookplate details. The warmth of a centuries-old bookshop.",
    palette: [
      { name: "Parchment", hex: "#f4e8d1" },
      { name: "Ink navy", hex: "#1e3a5f" },
      { name: "Leather", hex: "#8b5e3c" },
      { name: "Brass", hex: "#b8965a" },
      { name: "Sepia", hex: "#5c4033" },
    ],
    cssVars: {
      "--bg": "#f4e8d1",
      "--surface": "#faf2e6",
      "--accent": "#1e3a5f",
      "--accent-soft": "#4a6d94",
      "--glow": "#b8965a",
      "--wood": "#8b5e3c",
      "--text": "#3d2b1f",
      "--text-muted": "#7a6455",
      "--border": "#e0d2bb",
    },
  },
  {
    id: "garden",
    name: "Garden Nook",
    description:
      "Soft sage walls, blush pink blossoms, white wicker, and butterfly-wing accents. A sunlit reading corner in a greenhouse.",
    palette: [
      { name: "Sage", hex: "#d4e6d0" },
      { name: "Blush", hex: "#e8c4c4" },
      { name: "Moss", hex: "#7a9e6b" },
      { name: "Petal", hex: "#f2dcdc" },
      { name: "Soil", hex: "#5c4a3d" },
    ],
    cssVars: {
      "--bg": "#f6faf4",
      "--surface": "#ffffff",
      "--accent": "#7a9e6b",
      "--accent-soft": "#a8c99a",
      "--glow": "#e8c4c4",
      "--wood": "#d4c5b9",
      "--text": "#3d352e",
      "--text-muted": "#8a7e72",
      "--border": "#e0e8da",
    },
  },
  {
    id: "hygge",
    name: "Hygge Hearth",
    description:
      "Warm stone grey, muted lingonberry, soft candlelight, and thick knit textures. Scandinavian cozy, wool blankets and hot cocoa.",
    palette: [
      { name: "Stone", hex: "#e8e4e0" },
      { name: "Berry", hex: "#b85c5c" },
      { name: "Charcoal", hex: "#4a4543" },
      { name: "Candle", hex: "#f0d9a0" },
      { name: "Cocoa", hex: "#6b4e3d" },
    ],
    cssVars: {
      "--bg": "#f5f2ef",
      "--surface": "#fdfbf9",
      "--accent": "#b85c5c",
      "--accent-soft": "#d48989",
      "--glow": "#f0d9a0",
      "--wood": "#a89688",
      "--text": "#3a3533",
      "--text-muted": "#8a8079",
      "--border": "#e0dbd5",
    },
  },
];

function MiniBookCard({ vars }: { vars: Record<string, string> }) {
  return (
    <div
      className="flex items-center gap-3 p-3 rounded-xl border"
      style={{
        background: vars["--surface"],
        borderColor: vars["--border"],
      }}
    >
      {/* Mini cover */}
      <div
        className="w-10 h-14 rounded flex-shrink-0 flex items-center justify-center"
        style={{ background: `${vars["--accent"]}18` }}
      >
        <BookOpen size={16} style={{ color: vars["--accent"], opacity: 0.6 }} weight="duotone" />
      </div>
      {/* Info */}
      <div className="min-w-0">
        <div className="text-xs font-semibold truncate" style={{ color: vars["--text"] }}>
          The Name of the Wind
        </div>
        <div className="text-[10px]" style={{ color: vars["--text-muted"] }}>
          Patrick Rothfuss
        </div>
        <div className="flex gap-0.5 mt-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <svg
              key={s}
              className="w-2.5 h-2.5"
              viewBox="0 0 20 20"
              fill={s <= 4 ? vars["--glow"] : `${vars["--border"]}80`}
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <div
          className="inline-block text-[9px] font-medium px-1.5 py-0.5 rounded-full mt-1.5"
          style={{
            background: `${vars["--accent"]}18`,
            color: vars["--accent"],
          }}
        >
          Reading
        </div>
      </div>
    </div>
  );
}

function Swatch({ hex, name }: { hex: string; name: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div
        className="w-4 h-4 rounded-full border border-black/10 flex-shrink-0"
        style={{ background: hex }}
      />
      <span className="text-[10px] text-white/80">{name}</span>
    </div>
  );
}

function AddBookButton({ vars }: { vars: Record<string, string> }) {
  return (
    <button
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-medium transition-colors"
      style={{
        background: vars["--accent"],
        color: vars["--surface"],
      }}
    >
      + Add book
    </button>
  );
}

function ShelfToggle({ vars }: { vars: Record<string, string> }) {
  return (
    <div
      className="inline-flex items-center gap-0.5 p-0.5 rounded-full"
      style={{ background: `${vars["--border"]}60` }}
    >
      <span
        className="px-3 py-1 rounded-full text-[10px] font-medium"
        style={{ background: vars["--accent"], color: vars["--surface"] }}
      >
        Your Shelf
      </span>
      <span
        className="px-3 py-1 rounded-full text-[10px] font-medium"
        style={{ color: vars["--text-muted"] }}
      >
        Her Shelf
      </span>
    </div>
  );
}

function AestheticCard({ aesthetic }: { aesthetic: Aesthetic }) {
  const v = aesthetic.cssVars;
  const isDark = aesthetic.id === "starlight";

  return (
    <div
      className="rounded-2xl overflow-hidden border"
      style={{
        background: v["--bg"],
        borderColor: v["--border"],
      }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{
          background: v["--surface"],
          borderBottom: `1px solid ${v["--border"]}`,
        }}
      >
        <span
          className="text-xs font-semibold tracking-tight flex items-center gap-2"
          style={{ color: v["--text"] }}
        >
          <BookOpen size={14} style={{ color: v["--accent"] }} weight="duotone" />
          {aesthetic.name}
        </span>
        <span className="text-[10px]" style={{ color: v["--text-muted"] }}>
          {isDark ? "Dark mode" : "Light mode"}
        </span>
      </div>

      {/* Body */}
      <div className="px-4 py-4 space-y-4">
        {/* Palette swatches */}
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {aesthetic.palette.map((p) => (
            <div key={p.name} className="flex items-center gap-1">
              <div
                className="w-3.5 h-3.5 rounded-full ring-1 ring-black/10 flex-shrink-0"
                style={{ background: p.hex }}
              />
              <span className="text-[10px]" style={{ color: v["--text-muted"] }}>
                {p.name}
              </span>
            </div>
          ))}
        </div>

        {/* UI preview */}
        <div
          className="rounded-xl p-4 space-y-3"
          style={{ background: v["--bg"] }}
        >
          {/* Shelf toggle */}
          <ShelfToggle vars={v} />

          {/* Book cards row */}
          <div className="grid grid-cols-2 gap-2">
            <MiniBookCard vars={v} />
            <MiniBookCard vars={v} />
          </div>

          {/* CTA button */}
          <AddBookButton vars={v} />
        </div>

        {/* Description */}
        <p className="text-[11px] leading-relaxed" style={{ color: v["--text-muted"] }}>
          {aesthetic.description}
        </p>
      </div>
    </div>
  );
}

export default function PreviewPage() {
  return (
    <div className="min-h-screen bg-zinc-900 py-8 px-4">
      <div className="max-w-[1400px] mx-auto space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-lg font-semibold text-white tracking-tight">
            Reading Nook - Aesthetic Previews
          </h1>
          <p className="text-xs text-zinc-400">
            Each card shows the palette, book cards, shelf toggle, and CTA in that theme.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {aesthetics.map((a) => (
            <AestheticCard key={a.id} aesthetic={a} />
          ))}
        </div>

        <p className="text-center text-[10px] text-zinc-500 pt-2">
          Pick one and the whole app will be restyled in that aesthetic.
        </p>
      </div>
    </div>
  );
}
