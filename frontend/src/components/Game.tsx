import { useEffect, useRef, useState } from "react";
import { CheckCircle2, ChevronRight, Timer, Trophy, X } from "lucide-react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useGameStore } from "../store/gameStore";
import { EVENTS, socket } from "../lib/socket";
import type {
  CurrentQuestion,
  Player,
  QuestionOption,
  ResultRow,
  questionAckType,
  submitAckType,
} from "../types";
import toast from "react-hot-toast";

const LETTERS = ["A", "B", "C", "D", "E", "F"];
const OPTION_STYLES = [
  "from-fuchsia-500/20 to-fuchsia-500/5 border-fuchsia-400/40",
  "from-cyan-500/20 to-cyan-500/5 border-cyan-400/40",
  "from-amber-500/20 to-amber-500/5 border-amber-400/40",
  "from-emerald-500/20 to-emerald-500/5 border-emerald-400/40",
];

export default function Game() {
  const {
    currentQuestion,
    selectedAnswer,
    selectAnswer,
    setCurrentQuestion,
    finishGame,
    isHost,
    players,
    setPlayers,
  } = useGameStore();

  const { code = "" } = useParams();
  const navigate = useNavigate();

  const q = currentQuestion;
  const [timeLeft, setTimeLeft] = useState(15);

  // Position of the CURRENT question — derived from the question id, not the
  // answer count (which jumps ahead the moment an answer is locked in)
  const [questionNo, setQuestionNo] = useState(1);
  const lastQuestionId = useRef<number | null>(null);
  // set to the question id ONLY while its countdown is actively ticking —
  // guards auto-submit against the stale timeLeft===0 from the previous question
  const timerStartedFor = useRef<number | null>(null);
  // the correct answer, delivered by the submit_answer ack — reveals right/wrong
  const [revealAnswer, setRevealAnswer] = useState<string | null>(null);
  // Full length of the current round's countdown — drives the progress bar and
  // every reset. Updated directly from the server payload (ack or push).
  const [roundLength, setRoundLength] = useState(15);
  useEffect(() => {
    if (!q?.id) return;
    if (lastQuestionId.current === null) setQuestionNo(1);
    else if (q.id !== lastQuestionId.current) setQuestionNo((n) => n + 1);
    lastQuestionId.current = q.id;
  }, [q?.id]);

  // Reset the clock whenever the question changes — also disarms auto-submit
  // for this pass, so the previous question's 0 can't lock the new one.
  // The socket handlers below already set the clock directly; this is the
  // backup path (e.g. the first question set from the Lobby before mount).
  useEffect(() => {
    setTimeLeft(roundLength);
    timerStartedFor.current = null;
    setRevealAnswer(null);
  }, [q?.id, roundLength]);

  // Countdown — runs to zero regardless of answering; the reveal is instant but
  // the round isn't "over" until the timer elapses (that's when Next appears).
  // q?.id is a dep too so a new question always kicks the ticking even if the
  // timeLeft value happened to be identical to the previous round's.
  useEffect(() => {
    if (timeLeft <= 0) return;
    timerStartedFor.current = lastQuestionId.current; // timer is live for THIS question
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, q?.id]);

  // One submit path for BOTH clicks and timeout — identical payload each time
  const submitAnswer = (answer: string) => {
    if (!q || selectedAnswer !== null) return; // no question / already locked in
    selectAnswer(answer);
    socket.emit(
      EVENTS.SUBMIT_ANSWER,
      {
        code,
        questionId: q.id,
        answer, // "" on timeout — server scores it as wrong
        name: useGameStore.getState().name,
      },
      (
        response: submitAckType,
      ) => {
        // the server's ack carries the truth — reveal right/wrong with it
        if (response.data?.correctAnswer) {
          setRevealAnswer(response.data.correctAnswer);
        }
      },
    );
  };

  // Auto-submit an EMPTY answer when time runs out without a pick — but only
  // if the countdown actually ran for THIS question (not a stale zero)
  useEffect(() => {
    if (
      timeLeft === 0 &&
      selectedAnswer === null &&
      q &&
      timerStartedFor.current === q.id
    ) {
      submitAnswer("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, selectedAnswer, q]);

  // Results come from the backend (quiz_results) — client can't self-score
  // without the answers. When they arrive: store them + take everyone to Results
  useEffect(() => {
    const onResults = (data: { scores: ResultRow[] }) => {
      console.log(data);

      finishGame(data.scores);
      navigate(`/results/${code}`);
    };
    socket.on(EVENTS.QUIZ_RESULTS, onResults);
    return () => {
      socket.off(EVENTS.QUIZ_RESULTS, onResults);
    };
  }, [finishGame, navigate, code]);

  // New-question push for non-hosts — registered BEFORE the early return below
  // (hooks must run on every render, even when currentQuestion is null).
  // Payload shape: { data: question, timeLeft } — same as the host's ack.
  useEffect(() => {
    if (isHost) return;
    const handler = (response: {
      data: CurrentQuestion;
      timeLeft: number;
    }) => {
      // Set the clock directly (state, not a ref) so the countdown restarts
      // in the same batch as the new question — no fragile ref→effect relay.
      const t = response.timeLeft ?? 15;
      setRoundLength(t);
      setTimeLeft(t);
      setCurrentQuestion(response.data);
    };
    socket.on("question", handler);
    return () => {
      socket.off("question", handler);
    };
  }, [isHost, setCurrentQuestion]);

  // Connection-health listener (built-in reserved event — listen only)
  useEffect(() => {
    const onDropped = () => console.log("socket disconnected");
    socket.on("disconnect", onDropped);
    return () => {
      socket.off("disconnect", onDropped);
    };
  }, []);

  // Live player list with connected/disconnected status (from players_name)
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

      if (response.data && response.data.length > 0) {
        setPlayers(response.data);
      }
    };

    socket.on("players_name", handler);
    return () => {
      socket.off("players_name", handler);
    };
  }, [setPlayers, navigate]);

  // Deep-link guard: /game/:code without a running quiz → home
  if (!code || !currentQuestion) return <Navigate to="/" replace />;

  if (!q) {
    return (
      <div className="max-w-md text-center">
        <p className="text-white">No questions loaded.</p>
      </div>
    );
  }

  const revealed = selectedAnswer !== null;

  const handleOption = (option: QuestionOption) => {
    submitAnswer(option.text);
  };

  // ask the backend for the next question — it replies with the next question,
  // or with "you have completed the questions" when the quiz is over
  const handleNext = () => {
    socket.emit(EVENTS.NEXT_QUESTION, (response: questionAckType) => {
      if (response.data) {
        // Set the clock directly (state, not a ref) so Q2+ starts ticking
        // immediately in the same batch as the new question.
        const t = response.timeLeft ?? 15;
        setRoundLength(t);
        setTimeLeft(t);
        setCurrentQuestion(response.data);
        return;
      }

      // if (!response.success) {
      //   console.log(response);
      //   return;
      // }
      // // quiz over — placeholder score until the backend sends `quiz_results`
      // finishGame([
      //   {
      //     id: "me",
      //     name: useGameStore.getState().name || "You",
      //     score: 0,
      //   },
      // ]);
      // navigate(`/results/${code}`);
    });
  };

  return (
    <div className="w-full max-w-2xl space-y-6">
      {/* Progress + timer */}
      <div className="flex items-center gap-4">
        <span className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-white">
          Question {questionNo}
        </span>
        <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-500"
            style={{ width: `${roundLength > 0 ? (timeLeft / roundLength) * 100 : 0}%` }}
          />
        </div>
        <span
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold ${
            timeLeft <= 5
              ? "bg-red-500/20 text-red-300"
              : "bg-white/10 text-white"
          }`}
        >
          <Timer className="h-4 w-4" />
          {`${timeLeft}s`}
        </span>
      </div>

      {/* Players in the room — green dot = connected, red = disconnected */}
      <div className="flex flex-wrap items-center gap-2">
        {players.map((p) => (
          <span
            key={p.name}
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white"
          >
            <span
              className={`h-2 w-2 shrink-0 rounded-full ${
                p.connected
                  ? "bg-emerald-400 shadow-[0_0_6px_1px_rgba(52,211,153,0.7)]"
                  : "bg-red-500"
              }`}
            />
            {p.name}
          </span>
        ))}
      </div>

      {/* Question card */}
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl shadow-2xl">
        <h2 className="text-xl font-bold leading-relaxed text-white sm:text-2xl">
          {q.text}
        </h2>
      </div>

      {/* Options */}
      <div className="grid gap-3 sm:grid-cols-2">
        {q.options.map((option, i) => {
          const isPicked = selectedAnswer === option.text;
          const isCorrectOption = revealAnswer !== null && option.text === revealAnswer;
          const isWrongPick = isPicked && revealAnswer !== null && option.text !== revealAnswer;

          return (
            <button
              key={option.id}
              onClick={() => handleOption(option)}
              disabled={revealed}
              className={`flex items-center gap-4 rounded-2xl border bg-gradient-to-br p-4 text-left font-semibold transition
                ${OPTION_STYLES[i % OPTION_STYLES.length]}
                ${isCorrectOption ? "!border-emerald-400 !bg-emerald-500/30 text-white shadow-lg shadow-emerald-500/30" : ""}
                ${isWrongPick ? "!border-red-400 !bg-red-500/30 text-white shadow-lg shadow-red-500/30" : ""}
                ${isPicked && !isCorrectOption && !isWrongPick ? "!border-fuchsia-400 !bg-fuchsia-500/30 text-white shadow-lg shadow-fuchsia-500/20" : ""}
                ${revealed && !isPicked && !isCorrectOption ? "opacity-40" : ""}
                ${!revealed ? "text-white hover:scale-[1.02] hover:brightness-125 active:scale-[0.98] cursor-pointer" : "cursor-default"}`}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/15 font-black text-white">
                {LETTERS[i]}
              </span>
              <span>{option.text}</span>
            </button>
          );
        })}
      </div>

      {/* Reveal + next */}
      {revealed && (
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          {revealAnswer === null ? (
            // server ack hasn't arrived yet — neutral lock-in state
            <p className="flex items-center gap-2 text-lg font-bold text-cyan-300">
              <CheckCircle2 className="h-5 w-5" /> Answer locked in…
            </p>
          ) : selectedAnswer === "" ? (
            <p className="text-lg font-bold text-amber-400">
              Time's up! The answer was{" "}
              <span className="underline">{revealAnswer}</span>
            </p>
          ) : selectedAnswer === revealAnswer ? (
            <p className="flex items-center gap-2 text-lg font-bold text-emerald-400">
              <Trophy className="h-5 w-5" /> Correct! 🎉
            </p>
          ) : (
            <p className="flex items-center gap-2 text-lg font-bold text-red-400">
              <X className="h-5 w-5" /> Wrong — the answer was{" "}
              <span className="underline">{revealAnswer}</span>
            </p>
          )}
          {/* Next unlocks for the host only once the countdown has elapsed */}
          {isHost && timeLeft === 0 && (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-6 py-3 font-bold text-white shadow-lg shadow-fuchsia-500/30 transition hover:scale-[1.03] active:scale-[0.98]"
            >
              Next Question
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
