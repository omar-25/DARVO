require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRouter = require("./Server/User/User.Router/User_Router");
const propertyRoutes = require('./Server/Property/Property.Routers/Property_Routers');
const connection = require("./Server/DataBase");

const adminRouter = require("./Server/Admin/Admin_Router");
const app = express();

app.use(cors());
app.use(express.json());

connection();

mongoose.connection.once("open", async () => {
    try {
        await mongoose.connection.collection("properties").dropIndex("propertyID_1");
        console.log("Old index dropped successfully");
    } catch (error) {
        console.log("Index already dropped or not found:", error.message);
    }
});

app.use('/property', propertyRoutes);
app.use("/", userRouter);
app.use("/admin", adminRouter);

app.get('/login', (req, res) => {
  if (process.env.NODE_ENV !== "production") {
    return res.redirect("http://localhost:3000/login");
  }
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});


app.get('/', (req, res) => {
    res.send('Server side for Your application is now running....');
});

app.listen(process.env.PORT, () => {
    console.log('Connecting to server......');
    console.log(`Server now listening on port ${process.env.PORT}`);
    console.log(`Now you can run localhost:${process.env.PORT} and see a message`);
});