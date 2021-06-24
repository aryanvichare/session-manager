const express = require("express");
const cors = require("cors");
const http = require("http");
const bodyParser = require("body-parser");

const { Server } = require("socket.io");

const app = express();

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

server.listen(PORT);

let users = [];

const io = new Server(server, {
  cors: { origin: "http://localhost:3000", credentials: true },
});

app.use(bodyParser.json());
app.use(cors({ origin: "*", optionsSuccessStatus: 200 }));

app.get("/", (req, res) => {
  res.send("API is Running!");
});

app.post("/clients", (req, res) => {
  const { sessionId } = req.body;
  console.log(users);
  const clients = users.filter((user) => user.sessionId === sessionId);

  res.status(200).json({ clients });
});

io.on("connection", (socket) => {
  console.log("Connection Established.");

  // Create Room Event
  socket.on("join_room", ({ sessionId, name }) => {
    console.log(`${name} - ${sessionId} has connected`);
    socket.join(sessionId);

    users.push({ id: socket.id, name, sessionId });

    const allUsersInSession = users.filter(
      (user) => user.sessionId === sessionId
    );

    socket.to(sessionId).emit("new_user", { users: allUsersInSession, name });
  });

  // Add Message Event
  socket.on("new_message", ({ message, sessionId, name }) => {
    socket.to(sessionId).emit("user_message", {
      message,
      name,
    });
  });

  // User Disconnect Event
  socket.on("disconnect", function () {
    const disconnectedUser = users.filter((user) => user.id === socket.id)[0];
    users = users.filter((user) => user.id !== disconnectedUser?.id);

    console.log(`${disconnectedUser?.name} left the party!`);
    io.emit("user_disconnect", {
      name: disconnectedUser?.name,
      connectedUsers: users,
    });
  });
});
