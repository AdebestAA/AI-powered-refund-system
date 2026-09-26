import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import pool from "./config/db-config";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { activeUsersType, questionType } from "./types";
import { questions } from "./utils";

dotenv.config();

type roomDataType = {
  roomCode: string;
  questionNumber: number;
  timeLeft: number;
};
const app = express();
// room data
let activeUsers: activeUsersType = [];
const roomData: roomDataType[] = [];
// let currentQuestion: questionType | null = null;
// app.use(
//   cors({
//     origin: process.env.FRONTEND_URL || "http://localhost:5173",
//     credentials: true,
//   }),
// );
app.use(cors());
app.use(express.json());
app.use(cookieParser());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5179",
    methods: ["POST", "GET"],
  },
});

// this function closes round out of the box
function closeRound(roomCode: string) {
  const getRoomData = roomData.find(
    (item) => item.roomCode === roomCode,
  ) as roomDataType;
  const getAnswer = questions[getRoomData?.questionNumber - 1];

  io.to(roomCode).emit("round_over", {
    message: "time out ",
    correctAnswer: getAnswer.answer,
  });
}
setInterval(() => {
  if (roomData.length < 1) return;
  for (let i = 0; i < roomData.length; i++) {
    if (roomData[i].questionNumber === 0) continue;
    if (roomData[i].timeLeft > 0) {
      roomData[i].timeLeft -= 1;
      if (roomData[i].timeLeft === 0) {
        closeRound(roomData[i].roomCode);
      }
    }
  }
}, 1000);
io.on("connection", (socket) => {
  // const currentRoom = roomData.
  socket.on("start_game", (callback) => {
    const getRoomCode = [...socket.rooms].find((r) => r !== socket.id);
    console.log("start game set format", socket.rooms);
    console.log("start game array format ", [...socket.rooms]);

    const getTheCurrentRoomData = roomData.find(
      (item) => item.roomCode === getRoomCode,
    );
    // if the data is not found
    if (!getTheCurrentRoomData) {
      callback({
        message: "sorry, can't continue",
        success: false,
      });
      return;
    }
    console.log("before the condtional statement check");
    if (getTheCurrentRoomData.questionNumber >= questions.length) {
      callback({
        message: "you have completed the questions",
        success: false,
      });
      return;
    }
    const currentQuestion = questions[getTheCurrentRoomData.questionNumber];
    getTheCurrentRoomData.questionNumber += 1;
    getTheCurrentRoomData.timeLeft = 15;
    const { answer, ...rest } = currentQuestion;
    callback({
      data: rest,
      timeLeft: getTheCurrentRoomData.timeLeft,
    });

    io.to(getTheCurrentRoomData.roomCode).emit("question", {
      data: rest,
      timeLeft: getTheCurrentRoomData.timeLeft,
    });
  });

  // next question
  socket.on("next_question", (callback) => {
    const getRoomCode = [...socket.rooms].find((r) => r !== socket.id);
    console.log("set format", socket.rooms);
    console.log("array format", [...socket.rooms]);

    const getTheCurrentRoomData = roomData.find(
      (item) => item.roomCode === getRoomCode,
    );
    // if the data is not found
    if (!getTheCurrentRoomData) {
      callback({
        message: "sorry, can't continue with this",
        success: false,
      });
      return;
    }

    if (getTheCurrentRoomData.questionNumber >= questions.length) {
      // send result to frontend

      io.to(getTheCurrentRoomData.roomCode).emit("quiz_results", {
        scores: activeUsers
          .filter((item) => item.roomCode === getTheCurrentRoomData.roomCode)
          .sort((a, b) => b.score - a.score),
        message: "here is your score",
        success: true,
      });

      callback({
        message: "you have completed the questions",
        success: false,
      });
      return;
    }
    const currentQuestion = questions[getTheCurrentRoomData.questionNumber];
    getTheCurrentRoomData.questionNumber += 1;
    getTheCurrentRoomData.timeLeft = 15;
    const { answer, ...rest } = currentQuestion;
    callback({
      data: rest,
      timeLeft: getTheCurrentRoomData.timeLeft,
    });
    io.to(getTheCurrentRoomData.roomCode).emit("question", {
      data: rest,
      timeLeft: getTheCurrentRoomData.timeLeft,
    });
  });

  // SUBMIT ANSWER
  socket.on(
    "submit_answer",
    (
      data: { code: string; questionId: string; answer: string; name: string },
      callback,
    ) => {
      // EMPTY DATA FOR ALL OF THE EXPECTED fields

      if (!data.questionId || !data.code || !data.name) {
        callback({
          message: "something went wrong, can't complete operation",
          success: null,
        });
        return;
      }

      // check acitve rooms exist
      if (activeUsers.length === 0) {
        callback({
          message: "room doesn't exist",
          success: null,
        });
        return;
      }

      // check if user exist and exist in the said room
      const findUser = activeUsers.find(
        (item) => item.name === data.name && item.roomCode === data.code,
      );

      if (!findUser) {
        callback({
          message: "you currently don't exist in this room",
          success: null,
        });
        return;
      }

      // now get question and compare answer

      const getQuestion = questions.find(
        (item) => item.id === Number(data.questionId),
      );
      // if question now found return
      if (!getQuestion) {
        callback({
          message: "sorry can't complete operation",
          success: null,
        });
        return;
      }

      const compareAnswers =
        getQuestion.answer.trim().toLowerCase() ===
        (data.answer ?? "").trim().toLowerCase();
      if (compareAnswers) findUser.score += 1;
      // console.log("updated user", updateUserData);

      // const mapThrough = activeUsers.map((item) => {
      //   if (
      //     item.name === updateUserData.name &&
      //     item.roomCode === updateUserData.roomCode
      //   ) {
      //     return updateUserData;
      //   } else {
      //     return item;
      //   }
      // });
      // activeUsers = mapThrough ;

      callback({
        data: {
          name: findUser.name,
          score: findUser.score,
          correctAnswer: getQuestion.answer,
        },
        success: true,
      });
    },
  );

  // RESULTS

  // JOIN SOCKET
  socket.on("join_room", (data: { name: string; code: string }, callback) => {
    if (typeof callback !== "function") return;
    if (
      activeUsers.some(
        (item) => item.name === data.name && item.roomCode === data.code,
      )
    ) {
      callback({
        success: false,
        message:
          "someone has chosen this username already,please enter another name",
      });

      return;
    } else {
      for (const r of [...socket.rooms]) {
        if (r !== socket.id) {
          socket.leave(r);
        }
      }

      socket.join(data.code);
      activeUsers.push({
        name: data.name,
        roomCode: data.code,
        score: 0,
        connected: true,
        socketId: socket.id,
      });
      roomData.push({ roomCode: data.code, questionNumber: 0, timeLeft: 0 });
      io.to(data.code).emit("players_name", {
        errorMsg: null,
        data: activeUsers.filter((item) => item.roomCode === data.code),
      });
      callback({
        success: true,
        message: "you joined room successfully",
        data: activeUsers.filter((item) => item.roomCode === data.code),
      });
      return;
    }
  });

  // RECONNECT SOCKET

  socket.on("reconnect", (data: { name: string; code: string }, callback) => {
    if (typeof callback !== "function") return;
    // check user sent name and code match
    if (
      !activeUsers.some(
        (item) => item.name === data.name && item.roomCode === data.code,
      )
    ) {
      callback({
        success: false,
        message: "sorry,you haven't joined the game before",
        data: null,
      });
      return;
    }

    callback({
      success: true,
      message: "ok",
      data: activeUsers.filter((item) => item.roomCode === data.code),
    });
  });

  // disconnect socket by socket itself

  socket.on("disconnect", (reason) => {
    console.log("active players from disconnect", activeUsers);
    console.log("connection disconnect reason", reason);

    const updateActivePlayer = activeUsers.find(
      (item) => item.socketId === socket.id && item.connected,
    );

    if (updateActivePlayer) {
      updateActivePlayer.connected = false;
      io.to(updateActivePlayer.roomCode).emit("players_name", {
        errorMsg: null,
        data: activeUsers.filter(
          (item) => item.roomCode === updateActivePlayer.roomCode,
        ),
      });
    }

    console.log(socket.id);
  });
  //  closing parenthesis
});

app.get("/", (_req, res) => {
  res.json({ message: "Backend is running " });
});
app.get("/health", async (_req, res) => {
  const response = await pool.query(
    `SELECT q.id,q.text,c.answer,JSON_AGG(JSON_BUILD_OBJECT('id',o.id,'text',o.opt_text)) as options FROM questions q JOIN options o ON q.id = o.question_id JOIN correct_answers c ON q.id = c.question_id GROUP BY q.id,q.text,c.answer`,
  );

  res.json({ message: "api is healthy", success: true, data: response.rows });
});

const PORT = process.env.PORT || 4000;

// app.listen(PORT, () => {
//   console.log(`server listening on http://localhost:${PORT}`);
// });

app.use(globalErrorHandler);
server.listen(PORT, () => {
  console.log(`server listening on http://localhost:${PORT}`);
});
