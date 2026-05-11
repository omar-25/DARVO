
require("dotenv").config();
const path = require("path");
const express = require("express");
const userRouter = require("./Server/User/User.Router/User_Router");
const app = express();

const cors = require("cors");

const connection = require("./Server/DataBase");
connection();
app.use(cors());
app.use(express.json());
app.use("/", userRouter);

app.get('/login', (req, res) => {
  if (process.env.NODE_ENV !== "production") {
    return res.redirect("http://localhost:3000/login");
  }
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client", "build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

app.get('/', (req, res) => {
  res.send('Server side for Your application is now runinng....');
});

app.listen(process.env.PORT, () => {
  console.log('Connecting to server......');
  console.log(`Server now listening on port ${process.env.PORT}`);
  console.log(`Now you can run localhost:${process.env.PORT} and see a message`);
});

