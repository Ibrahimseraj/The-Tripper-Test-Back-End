const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectionToDB = require("./config/db");


//connction to DB
connectionToDB();

//init app
const app = express();


//apply middlewars
app.use(express.json());
app.use(cors());


//Routes
app.use("/auth", require("./routes/auth"));
app.use("/hotel/auth", require("./routes/hoteluserauth"));
app.use("/user", require("./routes/user"));
app.use("/hotel/profile", require("./routes/hoteluser"));
app.use("/hotel", require("./routes/hotels"));
app.use("/room", require("./routes/rooms"));
app.use("/reservation", require("./routes/reservation"));


const port = process.env.PORT || 5050;

app.listen(port, () => console.log(`am ok running on port: ${port} you can carry on!`));