const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const morgan = require("morgan");
const { mongoose } = require("mongoose");
const authRouter = require("./routes/auth");

const app = express();
dotenv.config();

//connect database, here mongodb, the database is in the mongodb atlas
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected"))
  .catch((err) => console.log("Error in connecting Database", err));

//middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//routes
app.use("/api/auth", authRouter);

//connecting to socket.io
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: `${process.env.REACT_APP_URL}`,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

//listening the app on the server on port
const port = process.env.PORT || 3001;
server.listen(port, () => console.log(`server is running at ${port}`));
