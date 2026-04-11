
  import { createRoot } from "react-dom/client";
  import { Component, ReactNode } from "react";
  import App from "./app/App.tsx";
  import "./styles/index.css";

  class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
    constructor(props: { children: ReactNode }) {
      super(props);
      this.state = { error: null };
    }
    static getDerivedStateFromError(error: Error) {
      return { error };
    }
    render() {
      if (this.state.error) {
        return (
          <div style={{ padding: 40, fontFamily: "monospace" }}>
            <h2 style={{ color: "red" }}>App crashed — check console for details</h2>
            <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
              {this.state.error.message}
              {"\n\n"}
              {this.state.error.stack}
            </pre>
          </div>
        );
      }
      return this.props.children;
    }
  }

  createRoot(document.getElementById("root")!).render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
