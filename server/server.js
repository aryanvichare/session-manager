import express from "express";
import dotenv from "dotenv";
import http from "http";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import { Server } from "socket.io";
import colors from "colors";
import { CORS_URL } from "./config.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

dotenv.config();

app.use(morgan("tiny"));
app.use(bodyParser.json({ limit: "10mb" }));

app.use(
  bodyParser.urlencoded({
    limit: "10mb",
    extended: true,
    parameterLimit: 50000,
  })
);

app.use(cors({ origin: CORS_URL, optionsSuccessStatus: 200 }));

app.get("/", (req, res) => {
  res.send("API is Running!");
});

io.on("connection", (socket) => {
  console.log("we have connected bois");

  // Create Room Event
  socket.on("join_room", (roomId) => {
    socket.join(roomId);
  });

  // New User Event
  socket.on("new_user", (name) => {
    socket.username = name;
    console.log(`${name} joined in the party!`);
    socket.broadcast.emit("new_user", { username: name });
  });

  // Add Message Event
  socket.on("new_message", ({ message, roomId }) => {
    socket.to(room).emit("Message", {
      message,
      name: socket.username,
    });
  });

  // User Disconnect Event
  socket.on("user_disconnect", function () {
    console.log(`${name} has left the party!`);
    io.emit("user_disconnect", { username: socket.username });
  });
});

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on Port ${PORT}`.yellow.bold
  )
);
