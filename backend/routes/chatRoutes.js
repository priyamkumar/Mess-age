const express = require("express"); 
const auth = require("../middleware/authMiddleware");
const { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup } = require("../controllers/chatControllers");

const router = express.Router();

router.route("/").post(auth, accessChat).get(auth, fetchChats);
router.route("/group").post(auth, createGroupChat)
router.route("/rename").put(auth, renameGroup)
router.route("/add").put(auth, addToGroup)
router.route("/remove").put(auth, removeFromGroup)

module.exports = router;