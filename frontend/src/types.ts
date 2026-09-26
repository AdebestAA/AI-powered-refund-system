export type QuestionOption = {
  id: string;
  text: string;
};

/** A question as the CLIENT sees it — the backend strips `answer` before sending */
export type CurrentQuestion = {
  id: number;
  text: string;
  options: QuestionOption[];
};

/** ack payload for the backend's start_game: the next question, or a "done" message */
export type questionAckType = {
  message?: string;
  success?: boolean;
  data?: CurrentQuestion;
  timeLeft?: number;
};

/** exact shape the backend sends in quiz_results → scores */
export type ResultRow = {
  name: string;
  roomCode: string;
  score: number;
};

export type Player = {
  id?: string;
  name: string;
  score?: number;
  socketId?: string;
  connected?: boolean;
  isHost?: boolean;
};

/** client no longer knows the answer — correctness is judged by the backend */
export type AnswerRecord = {
  questionId: number;
  selected: string;
};

/** ack payload for submit_answer — a single object, not an array */
export type submitAckType = {
  message?: string;
  success?: boolean | null;
  data?: {
    name: string;
    score: number;
    correctAnswer: string;
  };
};

export type ackType<T> = {
  message: string;
  success: boolean;
  data?: T[];
};
