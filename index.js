const express = require("express")
const connectToMongo = require("./db");
 const cors = require("cors");

const app = express();
 const bodyparser = require("body-parser");
// const User = require("./models/User");
// app.use(cors());
connectToMongo();
app.use(express.json())

const PORT = 5000;
// app.use((req, res, next) => {
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//     res.setHeader(
//       "Access-Control-Allow-Headers",
//       "Content-Type, Authorization"
//     );
//     next();
//   });
app.use(cors({
    origin: 'http://localhost:3000', // Replace * with the allowed origin
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
app.use("/auth", require("./routes/auth"));
app.use("/notes", require("./routes/notes"));


app.get("/", (req,res)=>{
    res.send("hello world")
})
//  app.post("/register",async (req,res) =>{
// //this creates a user in mongodb.
// user = await User.create({
//     Name:req.body.Name,
//     email:req.body.email,
//     mobile:req.body.mobile,
//     password:req.body.password
//  })
//  res.status(200).send("created sucessfully")
//  const data ={
//     user:{
//         id:user.id
//     }
//  }
//  })




 app.listen(PORT , (err)=>{
    if(err){
        console.log(err);
        return;
    }
    console.log("yup! server is listening at http://localhost:"+PORT)
})