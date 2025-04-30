import { Box } from "@mui/material";
import ChatSection from "./ChatSection";
import Sidebar from "./Sidebar";
import { useState } from "react";
import Header from "./Header";
import axios from "axios";
import { ChatState } from "../Context/ChatProvider";
import { server } from "./main";

export default function ChatPage() {
  const [fetchAgain, setFetchAgain] = useState(false);
const {user} = ChatState();
  const markAsRead = async (chat) => {
    let chatId = chat._id;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(`${server}/api/message/${chatId}`, {}, config);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Header markAsRead={markAsRead} />
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="90vh"
        width="98vw"
        padding="0.7vmax"
        gap="1vmax"
      >
        {/* Sidebar */}
        <Sidebar fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} markAsRead={markAsRead}/>
        {/* Main Chat Area */}
        <ChatSection fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} markAsRead={markAsRead}/>
        {/* User Info */}
      </Box>
    </>
  );
}
