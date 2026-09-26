import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./components/Home";
import CreateRoom from "./components/CreateRoom";
import JoinRoom from "./components/JoinRoom";
import Lobby from "./components/Lobby";
import Game from "./components/Game";
import Results from "./components/Results";
import NotFoundPage from "./components/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        handle: { title: "Home" },
        element: <Home />,
      },
      {
        path: "create",
        handle: { title: "Create Room" },
        element: <CreateRoom />,
      },
      {
        path: "join",
        handle: { title: "Join Game" },
        element: <JoinRoom />,
      },
      {
        path: "lobby/:code",
        handle: { title: "Lobby" },
        element: <Lobby />,
      },
      {
        path: "game/:code",
        handle: { title: "Game" },
        element: <Game />,
      },
      {
        path: "results/:code",
        handle: { title: "Results" },
        element: <Results />,
      },
    ],
  },
]);
