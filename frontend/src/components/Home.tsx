import { ChevronRight, Gamepad2, LogIn, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-md space-y-10 text-center">
      <div className="space-y-3">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/40">
          <Gamepad2 className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-4xl font-black tracking-tight text-white">
          Quiz<span className="text-fuchsia-400">Arena</span>
        </h1>
        <p className="text-slate-400">
          Real-time trivia battles with friends, powered by Socket.IO
        </p>
      </div>

      <div className="space-y-4">
        <button
          onClick={() => navigate("/create")}
          className="group flex w-full items-center justify-between rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-6 py-5 font-bold text-white shadow-lg shadow-fuchsia-500/30 transition hover:scale-[1.02] hover:shadow-fuchsia-500/50 active:scale-[0.98]"
        >
          <span className="flex items-center gap-3">
            <Play className="h-6 w-6 fill-current" />
            Create Room
          </span>
          <ChevronRight className="h-6 w-6 transition group-hover:translate-x-1" />
        </button>

        <button
          onClick={() => navigate("/join")}
          className="group flex w-full items-center justify-between rounded-2xl border border-white/15 bg-white/5 px-6 py-5 font-bold text-white backdrop-blur-xl transition hover:border-cyan-400/50 hover:bg-cyan-400/10 active:scale-[0.98]"
        >
          <span className="flex items-center gap-3">
            <LogIn className="h-6 w-6" />
            Join Game
          </span>
          <ChevronRight className="h-6 w-6 transition group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}

