
  import { createRoot } from "react-dom/client";
  import { Component, ReactNode } from "react";
  import App from "./app/App.tsx";
  import "./styles/index.css";

  /**
   * Stale-chunk recovery.
   *
   * Routes are code-split, so a tab opened before a deploy will try to import a
   * hashed chunk that the new deployment no longer has (e.g. HanaRemote-qyPFYBf1.js
   * → 404 → the whole page dies on a blank screen). The fix is a single hard reload:
   * the HTML always revalidates, so the reload pulls the new chunk names.
   * Guarded by sessionStorage so a genuinely broken build can't loop.
   */
  const RELOAD_KEY = "hana:chunk-reload";

  function isChunkLoadError(err: unknown): boolean {
    const msg = err instanceof Error ? `${err.name} ${err.message}` : String(err);
    return /dynamically imported module|Importing a module script failed|ChunkLoadError|Loading chunk .* failed|Failed to fetch dynamically/i.test(
      msg
    );
  }

  function reloadOnce(): boolean {
    try {
      const last = Number(sessionStorage.getItem(RELOAD_KEY) || 0);
      if (Date.now() - last < 30_000) return false; // already tried — let the error surface
      sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
    } catch {
      // sessionStorage unavailable (private mode / blocked) — reload anyway, once.
    }
    window.location.reload();
    return true;
  }

  // Vite fires this when a lazy route's preload 404s, before React ever sees it.
  window.addEventListener("vite:preloadError" as keyof WindowEventMap, (event: Event) => {
    event.preventDefault();
    reloadOnce();
  });

  class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
    constructor(props: { children: ReactNode }) {
      super(props);
      this.state = { error: null };
    }
    static getDerivedStateFromError(error: Error) {
      return { error };
    }
    componentDidCatch(error: Error) {
      if (isChunkLoadError(error)) reloadOnce();
    }
    render() {
      if (this.state.error && isChunkLoadError(this.state.error)) {
        // A deploy landed mid-session. reloadOnce() is already fetching the new
        // build; show a neutral line rather than a stack trace for that beat.
        return (
          <div style={{ padding: 40, fontFamily: "system-ui, sans-serif", color: "#00122F" }}>
            Updating to the latest version…
          </div>
        );
      }
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
