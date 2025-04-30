import React, { Fragment, useEffect, useState } from "react";
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import axios from "axios";
import { ChatState } from "../Context/ChatProvider";
import toast from "react-hot-toast";
import { getSender } from "./chatLogics";
import GroupChatModal from "./GroupChatModal";

export default function Sidebar({ fetchAgain, setFetchAgain, markAsRead }) {
  const {
    user,
    chats,
    setChats,
    selectedChat,
    setSelectedChat,
    notification,
    setNotification,
  } = ChatState();
  const [loggedUser, setLoggedUser] = useState();
  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      toast.error("Error");
      console.log(error);
    }
  };

  const handleClick = (chat) => {
    markAsRead(chat);
    setNotification(notification.filter((n) => n.chat._id !== chat._id));
    setSelectedChat(chat);
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userInfo"));
    setLoggedUser(storedUser);
  }, []);

  useEffect(() => {
    if (user) fetchChats();
  }, [user, fetchAgain]);

  return (
    <Box
      maxWidth={250}
      bgcolor="white"
      borderRight="1px solid #ddd"
      display="flex"
      flexDirection="column"
      padding={2}
      height="80vh"
    >
      <div className="flex justify-between">
        <Typography
          variant="h6"
          fontWeight="bold"
          padding={2}
          borderBottom="1px solid #ddd"
        >
          All Chats
        </Typography>
      </div>
      <GroupChatModal />
      <List>
        {chats.map((chat) => (
          <Fragment key={chat._id}>
            <ListItem
              className={`cursor-pointer ${
                selectedChat?._id === chat._id ? "bg-blue-100" : ""
              }`}
              button="true"
              onClick={() => handleClick(chat)}
            >
              <ListItemText
                primary={
                  !chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName
                }
                secondary={
                  chat.latestMessage &&
                  `${chat.latestMessage.sender.name} : ${
                    chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content
                  }`
                }
              />
              {<ListItemText />}
            </ListItem>
            <Divider />
          </Fragment>
        ))}
      </List>
    </Box>
  );
}
