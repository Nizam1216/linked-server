const express = require("express");
const router = express.Router();
const fetchuser = require("./middleware/fetchuser");
const Notes = require("../models/Notes");
const { validationResult, check } = require("express-validator");



// get all the notes using : GET method login required -------------------------------------ROUTE:1
router.get("/fetchallnotes",fetchuser,async (req,res) =>{
    //becouse we are using fetchuser we can get user from req.user.
   try {
    const notes = await Notes.find({user:req.user.id})
    res.json(notes);
   } catch (error) {
    console.error(error.message);
    res.status(500).send("internal server error");
   }

});

// create a new note using : POST method login required -------------------------------------ROUTE:2
router.post("/addnote",fetchuser, [
    check("title","title is too small").isLength({min:3}),
    check("description","description is too small").isLength({min:5})
    ], async (req,res) =>{

        try {
            const {title, description,tag} = req.body;
     //if error with above conditions occur
     const errors = validationResult(req);
     if(!errors.isEmpty()){
         return res.status(400).json({errors:errors.array()});
     };

        const note = new  Notes({
            title,description,tag,user:req.user.id
           
        })
        const savedNote = await note.save();
        res.json(savedNote);
     } catch (error) {
        console.error(error.message);
        res.status(500).send("internal server error");
     }

});


// update an existing note using : PUT method login required -------------------------------------ROUTE:3
router.put("/updatenote/:id", fetchuser, async (req,res) =>{

    const {title,description,tag} = req.body;
    try {
        const newNote = {};
        if(title)       { newNote.title = title;}
        if(description) {newNote.description = description;}
        if(tag)         {newNote.tag = tag;}
        //find the note which has to be updated.
        let note =await Notes.findByIdAndUpdate(req.params.id)
         if(!note){
            return res.send("note not found");
         }
         //check weather the person logged in and the persons note been accessing is same or not.
         if(note.user.toString() !== req.user.id){
            return res.status(401).send("Unauthorised Access!");
         }

         note = await Notes.findByIdAndUpdate(req.params.id ,{$set: newNote}, {new:true});
         res.json({note})
    } catch (error) {
        console.error(error.message);
        res.status(500).send("internal server error");
    }
});



// update an existing note using : PUT method login required -------------------------------------ROUTE:3
router.delete("/deletenote/:id", fetchuser, async (req,res) =>{

    const {title,description,tag} = req.body;
    
    try {
       
           //find the note which has to be updated.
           let note =await Notes.findByIdAndDelete(req.params.id)
           if(!note){
            return res.send("note not found");
         } 
           //check weather the person logged in and the persons note been accessing is same or not.
       
              if(note.user.toString() !== req.user.id){
            return res.status(401).send("Unauthorised Access!");
         }
      

         note = await Notes.findByIdAndUpdate(req.params.id);
         res.json("deleted Sucessfully")
         }
         //check weather the person logged in and the persons note been accessing is same or not.
      
     catch (error) {
        console.error(error.message);
        res.status(500).send("internal server error");
    }
});



module.exports = router;