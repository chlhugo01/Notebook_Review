const mongoose = require("mongoose");
const notebookSchema = new mongoose.Schema({
    topic: String,
    introduction: String,
    description: String,
    price: String,
    rating: String,
    createdAt:{type: Date, default: Date.now},
    img:
    {
        data: Buffer,
        contentType: String
    },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "comment"
    }]
});


module.exports = mongoose.model("notebook", notebookSchema);
