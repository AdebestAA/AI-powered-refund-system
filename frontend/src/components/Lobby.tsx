import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Copy, Check, Play, Crown, Users, Loader2 } from "lucide-react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useGameStore } from "../store/gameStore";
import { EVENTS, socket } from "../lib/socket";
import type {
  ackType,
  CurrentQuestion,
  Player,
  questionAckType,
} from "../types";

export default function Lobby() {
  const { isHost, players, name, setCurrentQuestion, setPlayers, joinRoom } =
    useGameStore();
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const roomCode: string = code as string;
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handler = (response: {
      errorMsg: string | null;
      data: Player[] | null;
    }) => {
      if (response.errorMsg) {
        toast.error(response.errorMsg);
        navigate(`/join`);
        return;
      }

      if (response.data && response?.data?.length > 0) {
        const mapthrough = response.data.map((item) => {
          return item;
        });
        setPlayers(mapthrough);
      }
    };

    socket.on("players_name", handler);

    return () => {
      socket.off("players_name", handler);
    };
  }, []);

  useEffect(() => {
    if (players.length > 0) {
      return;
    }

    let getPlayersInfo: { isHost?: boolean; name?: string } = {};
    try {
      getPlayersInfo = JSON.parse(localStorage.getItem("my-info") ?? "{}");
    } catch {
      getPlayersInfo = {};
    }

    if (!roomCode || !getPlayersInfo.name) {
      return;
    }

    socket.emit(
      EVENTS.RECONNECT,
      { code: roomCode, name: getPlayersInfo.name },
      (response: ackType<Player>) => {
        if (!response.success) {
          toast.error(response.message);
          return;
        }

        joinRoom(roomCode, getPlayersInfo.isHost ?? false);

        if (response?.data?.length) {
          setPlayers(response.data);
        }

        toast.success(`WELCOME BACK `);
      },
    );
  }, []);

  // start game effect — carries non-hosts into the game when the host starts.
  // Payload shape: { data: question, timeLeft } — same as the host's ack.
  useEffect(() => {
    if (isHost) {
      return;
    }
    const handler = (response: { data: CurrentQuestion; timeLeft: number }) => {
      setCurrentQuestion(response.data);
      navigate("/game/" + code);
    };

    socket.on("question", handler);

    return () => {
      socket.off("question", handler);
    };
  }, []);

  // Deep-link guard: /lobby/:code reached without joining from home → home
  if (!code) return <Navigate to="/" replace />;

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(roomCode);
      setCopied(true);
      toast.success("Code copied!");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Couldn't copy — note it down manually");
    }
  };

  const handleStart = () => {
    if (players.length < 1 && !isHost) return;
    // ask the backend for ONE question at a time
    socket.emit(EVENTS.START_GAME, (response: questionAckType) => {
      if (!response.data) {
        toast.error(response.message ?? "No questions available");
        return;
      }
      setCurrentQuestion(response.data);
      navigate(`/game/${roomCode}`);
      toast.success("Game starting!");
    });
  };

  const displayed = players.length
    ? players
    : [{ id: "me", name: name || "You", score: 0, isHost }];

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center space-y-2">
        <p className="text-sm font-medium text-slate-400">Room code</p>
        <button
          onClick={copyCode}
          className="group inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-8 py-4 backdrop-blur-xl transition hover:border-fuchsia-400/50 hover:bg-white/10"
        >
          <span className="font-mono text-4xl font-black tracking-[0.3em] text-white">
            {roomCode}
          </span>
          {copied ? (
            <Check className="h-5 w-5 text-emerald-400" />
          ) : (
            <Copy className="h-5 w-5 text-slate-400 transition group-hover:text-white" />
          )}
        </button>
        <p className="text-xs text-slate-500">Tap the code to copy it</p>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-semibold text-white">
            <Users className="h-5 w-5 text-fuchsia-400" />
            Players
          </h2>
          <span className="rounded-full bg-fuchsia-500/20 px-3 py-1 text-xs font-bold text-fuchsia-300">
            {displayed.length} joined
          </span>
        </div>

        <ul className="space-y-2">
          {displayed.map((p, i) => (
            <li
              key={p.id || i}
              className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 px-4 py-3"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-sm font-bold text-white">
                {/* {p.name?.charAt(0).toUpperCase()} */}
              </div>
              <span className="flex-1 font-medium text-white">{p.name}</span>
              {p.isHost && (
                <Crown className="h-4 w-4 text-amber-400" aria-label="host" />
              )}
            </li>
          ))}
        </ul>

        {players.length === 0 && (
          <p className="mt-4 flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Waiting for other players to join…
          </p>
        )}
      </div>

      {isHost && (
        <button
          onClick={handleStart}
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-4 font-bold text-white shadow-lg shadow-emerald-500/30 transition hover:scale-[1.02] hover:shadow-emerald-500/50 active:scale-[0.98]"
        >
          <Play className="h-5 w-5 fill-current" />
          Start Game
        </button>
      )}
    </div>
  );
}
