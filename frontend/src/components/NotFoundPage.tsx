import { Home, SearchX } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-md space-y-6 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-red-500 to-orange-500 shadow-lg shadow-red-500/40">
        <SearchX className="h-10 w-10 text-white" />
      </div>
      <div className="space-y-2">
        <h2 className="text-4xl font-black text-white">404</h2>
        <p className="text-slate-400">
          This page isn't part of the quiz…
        </p>
      </div>
      <button
        onClick={() => navigate("/")}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-3.5 font-semibold text-white shadow-lg shadow-fuchsia-500/30 transition hover:scale-[1.02] hover:shadow-fuchsia-500/50 active:scale-[0.98]"
      >
        <Home className="h-5 w-5" /> Back to Home
      </button>
    </div>
  );
}
