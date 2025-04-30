const express = require("express");
const auth = require("../middleware/authMiddleware");
const {
  sendMessage,
  allMessages,
  unseenMessages,
  readMessage,
} = require("../controllers/messageControllers");

const router = express.Router();

router.route("/").post(auth, sendMessage);
router.route("/unseen").get(auth, unseenMessages);
router.route("/:chatId").get(auth, allMessages).put(auth, readMessage);

module.exports = router;
