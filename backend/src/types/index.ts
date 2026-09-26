export type questionOptionsType = {
  id: string;
  text: string;
};

export type questionType = {
  id: number;
  text: string;
  answer: string;
  options: questionOptionsType[];
};

/** what actually leaves the server — `answer` is stripped before sending */
export type publicQuestionType = Omit<questionType, "answer">;

export type activeUsersType = {
  socketId: string;
  name: string;
  roomCode: string;
  score: number;
  connected: boolean;
}[];
