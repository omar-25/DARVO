
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./Server/DataBase");
connection();
app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server side for Your application is now runinng....');
});

app.listen(process.env.PORT, () => {
  console.log('Connecting to server......');
  console.log(`Server now listening on port ${process.env.PORT}`);
  console.log(`Now you can run localhost:${process.env.PORT} and see a message`);
});
