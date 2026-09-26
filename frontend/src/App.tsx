import { useEffect } from "react";
import { Outlet, useMatches } from "react-router-dom";
import { Toaster } from "react-hot-toast";

type RouteHandle = { title?: string };

/** App is the layout shell: ambient background + page title + toast host */
export default function App() {
  const matches = useMatches();
  const title = matches
    .map((m) => (m.handle as RouteHandle | undefined)?.title)
    .filter(Boolean)
    .pop();

  useEffect(() => {
    document.title = title ? `${title} · QuizArena` : "QuizArena";
  }, [title]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 p-4">
      {/* ambient background glows */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-violet-600/30 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-cyan-500/20 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/3 right-1/4 h-64 w-64 rounded-full bg-fuchsia-500/20 blur-[100px]" />

      <main className="relative z-10 flex w-full justify-center py-10">
        <Outlet />
      </main>

      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(12px)",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.1)",
          },
        }}
      />
    </div>
  );
}



