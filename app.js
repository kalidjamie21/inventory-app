require("dotenv").config(); // this allows .env data hiding to function throughout the app
const express = require('express');
const path = require("node:path");
const gamesRouter = require("./routes/gamesRouter");

const app = express();

// set EJS view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// router mount
app.use('/', gamesRouter);

// set the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, (error) => {
    if (error) {
        throw error;
    }
    console.log(`Express app listening on port ${PORT}!`);
});