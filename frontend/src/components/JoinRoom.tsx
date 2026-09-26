import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { ArrowLeft, LogIn, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "../store/gameStore";
import { EVENTS, socket } from "../lib/socket";
import type { ackType } from "../types";

export default function JoinRoom() {
  const { name, setName, joinRoom, setPlayers } = useGameStore();
  const navigate = useNavigate();
  const [code, setCode] = useState("");

  const handleJoin = () => {
    if (!name.trim()) {
      toast.error("Enter your name first!");
      return;
    }

    const roomCode = code.trim().toUpperCase();
    if (roomCode.length < 4) {
      toast.error("Enter the 6-character room code");
      return;
    }
    socket.emit(
      EVENTS.JOIN_ROOM,
      { code: roomCode, name: name },
      (response: ackType<unknown>) => {
        console.log("response from ack", response);
        if (!response.success) {
          console.log("run this");

          toast.error(response.message);
          return;
        }
        // console.log("got here");

        joinRoom(roomCode, false);
        // add info to localStorage
        localStorage.setItem(
          "my-info",
          JSON.stringify({ isHost: false, name: name }),
        );

        navigate(`/lobby/${roomCode}`);
        toast.success(`joined group ${roomCode}`);
      },
    );
  };

  useEffect(() => {
    const handler = (res: { message: string; data: [] }) => {
      // toast.success(res.message);
      setPlayers(res.data);

      navigate(`/join`);
    };

    socket.on("players_name", handler);

    return () => {
      socket.off("players_name", handler);
    };
  }, []);

  return (
    <div className="w-full max-w-md space-y-6">
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="text-center space-y-2">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-sky-500 shadow-lg shadow-cyan-500/40">
          <LogIn className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-3xl font-black text-white">Join Game</h2>
        <p className="text-slate-400">
          Got a code from a friend? Hop in and wait for the host
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
            placeholder="e.g. Alex"
            maxLength={20}
            autoFocus
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 outline-none transition focus:border-fuchsia-400/60 focus:bg-white/10"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">
            Room code
          </label>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && handleJoin()}
            placeholder="XXXXXX"
            maxLength={6}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center font-mono text-lg font-bold tracking-[0.4em] text-white uppercase placeholder-slate-600 outline-none transition focus:border-cyan-400/60 focus:bg-white/10"
          />
        </div>

        <button
          onClick={handleJoin}
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 px-4 py-3.5 font-semibold text-white shadow-lg shadow-cyan-500/30 transition hover:scale-[1.02] hover:shadow-cyan-500/50 active:scale-[0.98]"
        >
          <LogIn className="h-5 w-5 transition group-hover:translate-x-0.5" />
          Join Game
        </button>
      </div>
    </div>
  );
}
