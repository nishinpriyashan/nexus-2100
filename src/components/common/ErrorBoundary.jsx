import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("[NEXUS ErrorBoundary]", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center h-full min-h-32 bg-surface/30 rounded-xl border border-warning/30 p-6 text-center">
          <div className="text-warning text-xs font-bold tracking-widest uppercase mb-2">
            Component Error
          </div>
          <p className="text-secondary-text text-sm">
            {this.state.error?.message || "Something went wrong."}
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}
