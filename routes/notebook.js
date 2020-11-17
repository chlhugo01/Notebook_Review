const express = require("express");
const router = express.Router();
const notebook = require("../models/notebook");
const middle = require("../middleware");
const multer = require("multer");
const fs = require('fs'); 
const path = require('path');
const storage = multer.diskStorage({ 
    destination: (req, file, cb) => { 
        cb(null, './routes/uploads') 
    }, 
    filename: (req, file, cb) => { 
        cb(null, file.fieldname + '-' + Date.now()) 
    } 
}); 
const upload = multer({ storage: storage});


router.get("/", function (req, res) {

    notebook.find({}, function (err, allnotebook) {
        if (err) {
            console.log(err);
        } else {
            res.render("notebook/index", { notebook: allnotebook, currentUser: req.user });
        }
    })
});
router.post("/", middle.isLoggedIn, middle.isadmin, upload.single("image"), function (req, res) {
    console.log(req.file);
    req.body.notebook.author = {
        id: req.user._id,
        username: req.user.username
    };
    req.body.notebook.img={
        data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)), 
            contentType: 'image/png'
    }
    notebook.create(req.body.notebook, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/notebook");
        }
    });
});

router.get("/new", middle.isLoggedIn, function (req, res) {
    res.render("notebook/new");
});

router.get("/:id", function (req, res) {
    notebook.findById(req.params.id).populate("comments").exec(function (err, foundnotebook) {
        if (err) {
            console.log(err);
        } else {
            console.log(foundnotebook);
            res.render("notebook/show", { notebook: foundnotebook });
        }
    })
})

router.get("/:id/edit", middle.checkNotebookOwnership, function (req, res) {
    notebook.findById(req.params.id, function (err, foundnotebook) {
        res.render("notebook/edit", { notebook: foundnotebook });
    })
});

router.put("/:id", middle.checkNotebookOwnership, function (req, res) {

    notebook.findByIdAndUpdate(req.params.id, req.body.notebook, function (err, updated) {
        if (err) {
            res.redirect("/notebook");
        }
        else {
            res.redirect("/notebook/" + req.params.id);
        }
    })
})

router.delete("/:id", middle.checkNotebookOwnership, function (req, res) {
    notebook.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.redirect("/notebook");
        }
        else {
            res.redirect("/notebook");
        }
    })
})

module.exports = router;
