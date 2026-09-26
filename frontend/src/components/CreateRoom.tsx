import { toast } from "react-hot-toast";
import { ArrowLeft, Sparkles, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "../store/gameStore";
import { EVENTS, generateRoomCode, socket } from "../lib/socket";
import type { ackType } from "../types";

export default function CreateRoom() {
  const { name, setName, joinRoom } = useGameStore();
  const navigate = useNavigate();

  const handleCreate = () => {
    if (!name.trim()) {
      toast.error("Enter your name first!");
      return;
    }
    const code = generateRoomCode();

    // persist identity so a page refresh can reconnect to the lobby
    // (same pattern JoinRoom uses — Lobby reads this on mount)
    localStorage.setItem(
      "my-info",
      JSON.stringify({ isHost: true, name: name }),
    );

    socket.emit(
      EVENTS.JOIN_ROOM,
      { code: code, name: name },
      (response: ackType<unknown>) => {
        console.log(response);
      },
    );
    joinRoom(code, true);
    navigate(`/lobby/${code}`);
    toast.success(`Room ${code} created — share the code!`);
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="text-center space-y-2">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/40">
          <Sparkles className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-3xl font-black text-white">Create a Room</h2>
        <p className="text-slate-400">
          You'll host the game — share your code with friends
        </p>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-2xl space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
            <Users className="h-4 w-4" /> Your name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            placeholder="e.g. Alex"
            maxLength={20}
            autoFocus
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 outline-none transition focus:border-fuchsia-400/60 focus:bg-white/10"
          />
        </div>

        <button
          onClick={handleCreate}
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-3.5 font-semibold text-white shadow-lg shadow-fuchsia-500/30 transition hover:scale-[1.02] hover:shadow-fuchsia-500/50 active:scale-[0.98]"
        >
          <Sparkles className="h-5 w-5 transition group-hover:rotate-12" />
          Create Room
        </button>
      </div>
    </div>
  );
}
