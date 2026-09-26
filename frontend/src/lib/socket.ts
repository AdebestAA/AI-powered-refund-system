import { io } from "socket.io-client";

export const socket = io("http://localhost:4000/");

export const EVENTS = {
  JOIN_ROOM: "join_room",
  RECONNECT: "reconnect",
  SEND_MESSAGE: "send_message",
  RECIEVE_MESSAGE: "recieve_message",

  CREATE_ROOM: "create_room",
  ROOM_USERS: "room_users",
  START_GAME: "start_game",
  NEXT_QUESTION: "next_question",
  QUIZ_QUESTIONS: "quiz_questions",
  SUBMIT_ANSWER: "submit_answer",
  QUIZ_RESULTS: "quiz_results",
};

/** 6-char alphanumeric room code, e.g. "K7QP2X" */
export function generateRoomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no confusing 0/O, 1/I
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}
