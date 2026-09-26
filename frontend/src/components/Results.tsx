import { Home, RotateCcw, Trophy } from "lucide-react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useGameStore } from "../store/gameStore";
import { useEffect } from "react";
import { socket } from "../lib/socket";
import toast from "react-hot-toast";

const MEDALS = ["🥇", "🥈", "🥉"];

export default function Results() {
  const { finalScores, isHost, joinRoom, resetGame } = useGameStore();
  const { code = "" } = useParams();
  const navigate = useNavigate();
  const sorted = [...finalScores].sort((a, b) => b.score - a.score);

  useEffect(() => {
    const handler = (response: { message: string }) => {
      // Single cleanup path for a torn-down room: clear zustand AND the
      // persisted identity, then leave — same as pressing Home yourself.
      resetGame();
      if (response.message) {
        toast(response.message);
      }
      navigate("/");
    };
    socket.on("game_ended", handler);

    return () => {
      socket.off("game_ended", handler);
    };
  }, [navigate, resetGame]);

  // Deep-link guard: can't view results without playing a round first
  if (!code) return <Navigate to="/" replace />;

  return (
    <div className="w-full max-w-md space-y-6 text-center">
      <div className="space-y-3">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/40">
          <Trophy className="h-10 w-10 text-white" />
        </div>
        <h2 className="text-3xl font-black text-white">Final Results</h2>
        <p className="text-slate-400">Room {code}</p>
      </div>

      <div className="space-y-2">
        {sorted.length === 0 && (
          <p className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-slate-400">
            No scores to show — finish a game round first.
          </p>
        )}
        {sorted.map((p, i) => (
          <div
            key={p.name}
            className={`flex items-center gap-4 rounded-2xl border px-5 py-4 backdrop-blur-xl ${
              i === 0
                ? "border-amber-400/40 bg-amber-400/10 shadow-lg shadow-amber-500/10"
                : "border-white/10 bg-white/5"
            }`}
          >
            <span className="text-2xl w-8 text-left">
              {MEDALS[i] ?? `${i + 1}.`}
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 font-bold text-white">
              {p.name.charAt(0).toUpperCase()}
            </div>
            <span className="flex-1 text-left font-semibold text-white">
              {p.name}
            </span>
            <span className="font-mono text-lg font-bold text-fuchsia-300">
              {p.score}
            </span>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        {isHost && (
          <button
            onClick={() => {
              joinRoom(code, isHost);
              navigate(`/lobby/${code}`);
            }}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-3.5 font-semibold text-white shadow-lg shadow-fuchsia-500/30 transition hover:scale-[1.02] active:scale-[0.98]"
          >
            <RotateCcw className="h-5 w-5" /> Play Again
          </button>
        )}
        <button
          onClick={() => {
            // Host tears the room down on the server; non-host just leaves.
            if (isHost) {
              socket.emit("end_game");
            }
            resetGame();
            navigate("/");
          }}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3.5 font-semibold text-white transition hover:bg-white/10 active:scale-[0.98]"
        >
          <Home className="h-5 w-5" /> Home
        </button>
      </div>
    </div>
  );
}
