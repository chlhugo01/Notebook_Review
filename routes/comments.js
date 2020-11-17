const express = require("express");
const router = express.Router({ mergeParams: true });
const notebook = require("../models/notebook");
const comment = require("../models/comment");
const middle = require("../middleware")

router.get("/new", middle.isLoggedIn, function (req, res) {
    notebook.findById(req.params.id, function (err, foundnotebook) {
        if (err) {
            console.log(err);
        }
        res.render("comments/new", { notebook: foundnotebook });
    })
});

router.post("/", middle.isLoggedIn, function (req, res) {
    notebook.findById(req.params.id, function (err, notebook) {
        if (err) {
            console.log(err);
            res.redirect("/notebook");
        } else {
            comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    req.flash("error","Something went wrong");
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    notebook.comments.push(comment);
                    notebook.save();
                    req.flash("success","Added comment")
                    res.redirect("/notebook/" + notebook._id);
                }
            })
        }
    })
});
router.get("/:comment_id/edit", middle.checkNotebookOwnership,function (req, res) {
    comment.findById(req.params.comment_id, function (err, foundcomment) {
        if (err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", { notebook_id: req.params.id, comment: foundcomment })
        }
    });
})

router.put("/:comment_id", middle.checkNotebookOwnership,function (req, res) {
    comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComent) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/notebook/" + req.params.id)
        }
    });
})

router.delete("/:comment_id", middle.checkNotebookOwnership,function (req, res) {
    comment.findByIdAndRemove(req.params.comment_id, function (err) {
        if (err) {
            res.redirect("back");
        }
        else {
            req.flash("success","Deleted");
            res.redirect("/notebook/" + req.params.id);
        }
    })
})

module.exports = router;