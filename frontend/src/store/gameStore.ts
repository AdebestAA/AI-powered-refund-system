import { create } from "zustand";
import type {
  AnswerRecord,
  CurrentQuestion,
  Player,
  ResultRow,
} from "../types";


type GameState = {
  name: string;
  roomCode: string;
  isHost: boolean;
  players: Player[];
  // ONE question at a time, exactly as the backend sends it (no `answer` on it)
  currentQuestion: CurrentQuestion | null;
  selectedAnswer: string | null;
  answers: AnswerRecord[];
  finalScores: ResultRow[];

  setName: (name: string) => void;
  joinRoom: (code: string, isHost: boolean) => void;
  resetGame: () => void;
  setPlayers: (players: Player[]) => void;
  setCurrentQuestion: (question: CurrentQuestion | null) => void;
  selectAnswer: (answer: string) => void;
  finishGame: (scores: ResultRow[]) => void;
};

const initialRun = {
  players: [] as Player[],
  currentQuestion: null as CurrentQuestion | null,
  selectedAnswer: null as string | null,
  answers: [] as AnswerRecord[],
  finalScores: [] as ResultRow[],
};

export const useGameStore = create<GameState>((set, get) => ({
  name: "",
  roomCode: "",
  isHost: false,
  ...initialRun,

  setName: (name) => set({ name }),

  // Entering a room (host or player) keeps the name
  joinRoom: (code, isHost) => {
    // const others = get();
    set({ roomCode: code, isHost });
  },

  // Back to home: fresh everything, but keep the typed name for convenience.
  // Also drops the persisted identity so a later visit can't RECONNECT
  // into a room that was just torn down.
  resetGame: () => {
    try {
      localStorage.removeItem("my-info");
    } catch {
      // storage unavailable (private mode etc.) — store reset still applies
    }
    set({ roomCode: "", isHost: false, ...initialRun });
  },

  setPlayers: (players) => set({ players }),

  // store the single question the backend just sent; unlocks the answer picker
  setCurrentQuestion: (question) =>
    set({ currentQuestion: question, selectedAnswer: null }),

  // client can't judge correctness anymore (no `answer` on the question) —
  // record the pick, the backend does the scoring
  selectAnswer: (answer) => {
    const { currentQuestion, answers, selectedAnswer } = get();
    if (!currentQuestion || selectedAnswer !== null) return; // already locked in
    set({
      selectedAnswer: answer,
      answers: [
        ...answers,
        { questionId: currentQuestion.id, selected: answer },
      ],
    });
  },

  finishGame: (scores) => set({ finalScores: scores, selectedAnswer: null }),
}));
