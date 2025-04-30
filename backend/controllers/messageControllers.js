const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;
  if (!content || !chatId) {
    res.status(400);
    throw new Error("Please fill all the fields.");
  }
  const newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
    readBy: [req.user._id]
  };
  try {
    let message = await Message.create(newMessage);
    message = await message.populate("sender", "name");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name email",
    });
    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });
    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const allMessages = asyncHandler(async (req, res) => {
  try {
    let messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    console.log(error);
    throw new Error(error.message);
  }
});

const unseenMessages = asyncHandler(async (req, res) => {
  try {
    let messages = await Message.find({
      readBy: { $ne: req.user._id },
    })
      .populate("sender", "name email")
      .populate({
        path: "chat",
        populate: {
          path: "users",
          select: "name email _id",
        },
      });

    messages = messages.filter(
      (message) =>
        message.chat &&
        message.chat.users &&
        message.chat.users.some(
          (u) => u._id.toString() === req.user._id.toString()
        )
    );

    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const readMessage = asyncHandler(async (req, res) => {
  try {
    let messages = await Message.updateMany(
      { chat: req.params.chatId, readBy: { $ne: req.user._id } },
      { $push: { readBy: req.user._id } }
    );
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { sendMessage, allMessages, unseenMessages, readMessage };
