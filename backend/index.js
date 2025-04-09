const express = require("express");
const dotenv = require("dotenv");
const connectDb = require("./utils/connectDb");
const chats = require("./data");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();
const PORT = process.env.PORT || 5000;

connectDb();
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Working",
  });
});

app.get("/api/chat/:id", (req, res) => {
  const singleChat = chats.find((c) => c._id === req.params.id);
  res.send(singleChat);
});

app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"))

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
