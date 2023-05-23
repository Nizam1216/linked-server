const mongoose = require("mongoose");
MONGO_url = "mongodb+srv://nizam:20h65a1216@cluster0.bzysdzf.mongodb.net/Razaq?retryWrites=true&w=majority"

const connectToMongo =  () =>{

  mongoose.connect(MONGO_url)
    .then(()=>{
        console.log("connected to mongodb database through mongoose");
    })
   
}

module.exports = connectToMongo;