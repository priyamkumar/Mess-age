const express = require("express"); 
const { registerUser, authUser, allUsers } = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(registerUser).get(auth, allUsers);
router.post("/login", authUser);

module.exports = router;