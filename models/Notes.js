const mongoose = require("mongoose");

const NotesSchema = new mongoose.Schema({
    user: {
         type: mongoose.Schema.Types.ObjectId, 
         ref: 'User'
         },
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    tag: {
        type: String,
    },
    date:{
        type:Date,
        default:Date.now
    }
});

const Notes = mongoose.model("notes", NotesSchema);
module.exports = Notes;