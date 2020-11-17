const notebook = require("../models/notebook");
const comment = require("../models/comment");
const user = require("../models/user");
const middlewareObj = {
};
middlewareObj.checkNotebookOwnership = function(req,res,next){
        if(req.isAuthenticated()){
            notebook.findById(req.params.id, function (err, foundnotebook) {
                if (err) {
                    req.flash("error","notebook not found");
                    res.redirect("back");
                }
                else {if(foundnotebook.author.id.equals(req.user._id)){
                    next();
                }
                else{
                    req.flash("error","No permission");
                    res.redirect("back");
                }
                }
            });
        }
        else{
            req.flash("error","You need to be log in to do that!");
            res.redirect("/login");
        }
    }
middlewareObj.checkCommentOwnership =function(req, res, next) {
    if (req.isAuthenticated()) {
        comment.findById(req.params.comment_id, function (err, foundcomment) {
            if (err) {
                req.flash("error","comment not found");
                res.redirect("back");
            }
            else {
                if (foundcomment.author.id.equals(req.user._id)) {
                    next();
                }
                else {
                    req.flash("error","No permission");
                    res.redirect("back");
                }
            }
        });
    }
    else {
        req.flash("error","You need to be log in to do that!");
        res.redirect("/login");
    }
}
middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error","You need to be log in to do that!");
    res.redirect("/login");
}
middlewareObj.isadmin = function(req, res, next) {
    if( req.user.adminCode){
        return next();
    }
    req.flash("error","You have to be admin!");
    res.redirect("back");
}

module.exports = middlewareObj;