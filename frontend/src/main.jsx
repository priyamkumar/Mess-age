import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Error from "./Error.jsx";
import Home from "./Home.jsx";
import ChatPage from "./ChatPage.jsx";
import ChatProvider from "../Context/ChatProvider.jsx";
import { ThemeProvider, createTheme } from "@mui/material/styles";

export const server = "http://localhost:5001"
const theme = createTheme();

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ChatProvider>
        <App />
      </ChatProvider>
    ),
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/chats",
        element: <ChatPage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <RouterProvider router={router}></RouterProvider>
    </ThemeProvider>
  </StrictMode>
);
