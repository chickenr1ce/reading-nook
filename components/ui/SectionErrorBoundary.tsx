"use client";

import React, { Component, type ReactNode } from "react";
import { WarningCircle, ArrowClockwise } from "@phosphor-icons/react";

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class SectionErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("SectionErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-2xl bg-surface-elevated border border-border p-6 text-center">
          <div className="w-10 h-10 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto mb-3">
            <WarningCircle size={20} weight="bold" />
          </div>
          <h4 className="text-sm font-semibold text-text-primary mb-1">
            {this.props.fallbackTitle || "Failed to load section"}
          </h4>
          <p className="text-xs text-text-secondary max-w-sm mx-auto mb-4">
            An unexpected error occurred while rendering this component.
          </p>
          <button
            onClick={this.handleReset}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-border/40 text-text-secondary hover:text-text-primary text-xs font-medium transition-colors"
          >
            <ArrowClockwise size={13} weight="bold" />
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
