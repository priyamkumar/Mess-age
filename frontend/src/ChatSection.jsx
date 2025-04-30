import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { styled } from "@mui/system";
import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import { getSender, getSenderFull } from "./ChatLogics";
import ProfileModal from "./ProfileModal";
import UpdateGroupModal from "./UpdateGroupModal";
import Loader from "./Loader";
import axios from "axios";
import io from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "./typing.json";

const ScrollArea = styled(Box)(({ theme }) => ({
  overflowY: "auto",
  flex: 1,
  marginBottom: "1rem",
  paddingRight: "0.5rem",
  display: "flex",
  flexDirection: "column",
}));

const ENDPOINT = "http://localhost:5001";
let socket, selectedChatCompare;

export default function ChatSection({ fetchAgain, setFetchAgain, markAsRead }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const {
    user,
    chats,
    setChats,
    selectedChat,
    setSelectedChat,
    notification,
    setNotification,
  } = ChatState();
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const MessageBubble = styled(Box)(({ theme, sender }) => ({
    padding: theme.spacing(1.5),
    borderRadius: theme.spacing(2),
    maxWidth: "60%",
    alignSelf: sender._id !== user._id ? "flex-start" : "flex-end",
    backgroundColor:
      sender._id === user._id
        ? theme.palette.primary.light
        : theme.palette.success.light,
    color: theme.palette.text.primary,
  }));

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;
    let chatId = selectedChat._id;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/message/${chatId}`, config);
      setMessages(data);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      console.log(error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!selectedChat) return;
    socket.emit("stop typing", selectedChat._id);
    let chatId = selectedChat._id;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      setNewMessage("");
      const { data } = await axios.post(
        "/api/message/",
        {
          content: newMessage,
          chatId,
        },
        config
      );
      setMessages((prevMessages) => [...prevMessages, data]);
      socket.emit("new message", data);
      setFetchAgain((fetchAgain) => !fetchAgain);
    } catch (error) {
      console.log(error);
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    let timerLength = 3000;
    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  const scrollRef = useRef();

  useEffect(() => {
    if (user) {
      socket = io(ENDPOINT);
      socket.emit("setup", user);
      socket.on("connected", () => setSocketConnected(true));
    }
  }, [user]);

  useEffect(() => {
    if (!socket) return;
    setIsTyping(false);
    socket.off("typing");
    socket.off("stop typing");
    socket.on("typing", (room) => {
      if (selectedChat && selectedChat._id === room) {
        setIsTyping(true);
      }
    });
    socket.on("stop typing", (room) => {
      if (selectedChat && selectedChat._id === room) {
        setIsTyping(false);
      }
    });
  }, [selectedChat]);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    if (!socket) return;
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        if (!notification.includes(newMessageReceived)) {
          setNotification((n) => [newMessageReceived, ...n]);
        }
      } else {
        markAsRead(newMessageReceived.chat);
        setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
      }
      setFetchAgain((fetchAgain) => !fetchAgain);
    });

    return () => {
      socket.off("message received");
    };
  }, [socket]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return selectedChat ? (
    loading ? (
      <Box
        flex={1}
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="80vh"
        backgroundColor="white"
      >
        <Loader />{" "}
      </Box>
    ) : (
      <Box flex={1} display="flex" flexDirection="column" height="80vh">
        <Card sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <CardContent
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              padding: 2,
              overflowY: "hidden",
            }}
          >
            {!selectedChat.isGroupChat ? (
              <div className="flex justify-between gap-2">
                {" "}
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {getSender(user, selectedChat.users)}
                </Typography>
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />{" "}
              </div>
            ) : (
              <div className="flex justify-between gap-2">
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {selectedChat.chatName}
                </Typography>
                <UpdateGroupModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                />
              </div>
            )}

            <ScrollArea ref={scrollRef}>
              <Box display="flex" flexDirection="column" gap={1.5}>
                {messages.map((msg) => (
                  <MessageBubble key={msg._id} sender={msg.sender}>
                    <Typography variant="body2">
                      <strong>{msg.sender.name}:</strong> {msg.content}
                    </Typography>
                  </MessageBubble>
                ))}
              </Box>
              {isTyping && (
                <Box>
                  <Lottie
                    options={defaultOptions}
                    // height={50}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </Box>
              )}
            </ScrollArea>
            <Box
              component="form"
              display="flex"
              gap={1}
              onSubmit={(e) => sendMessage(e)}
            >
              <TextField
                placeholder="Type your message..."
                value={newMessage}
                fullWidth
                size="small"
                onChange={(e) => typingHandler(e)}
              />
              <Button variant="contained" type="submit">
                Send
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    )
  ) : (
    <Box flex={1} width="80%">
      <Card
        sx={{
          height: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Click on a user to start chatting.
        </Typography>
      </Card>
    </Box>
  );
}
