const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const methodOverride= require("method-override");
const multer = require("multer");
const User = require("./models/user")
const notebook = require("./models/notebook");
const comment = require("./models/comment");
const fs = require('fs'); 
const path = require('path'); 
require('dotenv/config'); 
const port = 3000;

const commentRoutes = require("./routes/comments"), notebookRoutes = require("./routes/notebook"), indexRoutes = require("./routes/index")

mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb+srv://account_name+account_password@cluster1.tmjkh.mongodb.net/testing1?retryWrites=true&w=majority", { useNewUrlParser: true, useCreateIndex: true }).then(() =>{
    console.log("connected to db!!");
}).catch(err =>{
    console.log("err",err.message);
});
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require('moment');

app.use(require("express-session")({
    secret: "abc",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/",indexRoutes);
app.use("/notebook",notebookRoutes);
app.use("/notebook/:id/comments",commentRoutes);



app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));

//app.listen(process.env.PORT, process.env.IP);
