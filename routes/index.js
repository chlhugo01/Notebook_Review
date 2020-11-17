const express=require("express");
const router = express.Router();
const passport= require("passport");
const User= require("../models/user");

router.get("/", function (req, res) {
    res.redirect("/notebook");
});
router.get("/register", function(req, res){
    res.render("register"); 
 });
 router.post("/register", function(req, res){
     const newUser = new User({username: req.body.username});
     if(req.body.adminCode === "secret"){
        newUser.adminCode = true;
     };
     User.register(newUser, req.body.password, function(err, user){
         if(err){
            req.flash("error",err.message);
             return res.redirect("register");
         }
         passport.authenticate("local")(req, res, function(){
            req.flash("success","Welcome to NotebookReview " + user.username);
            res.redirect("/notebook"); 
         });
     });
 });
 
 // show login form
 router.get("/login", function(req, res){
    res.render("login"); 
 });
 // handling login logic
 router.post("/login", passport.authenticate("local", 
     {
         successRedirect: "/notebook",
         failureRedirect: "/login"
     }), function(req, res){
 });
 
 // logic route
 router.get("/logout", function(req, res){
    req.logout();
    req.flash("success","log you out")
    res.redirect("/notebook");
 });
module.exports = router;