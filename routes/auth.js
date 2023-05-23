const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser');
const User = require("../models/User");
const { validationResult, check } = require("express-validator");
router.use(bodyParser.urlencoded({ extended: true }));
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("./middleware/fetchuser")
JWT_SECRET = "if i tell you it wont h@ppen";
// Create a new user using POST method and does not require login ------------------------------------------ROUTE 1
router.post("/",[
check("Name","Enter Valid Name").isLength({min:3}),
check("email","enter Valid email").isEmail(),
check("mobile","number should be 10 digits").isLength({min:10,max:10}),
check("password","password is too small").isLength({min:5})
],
async (req,res) =>{
    //if error with above conditions occur
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    // check weather the user with this mail and phone number already exist?
    try {
        
    
        const [userWithEmail, userWithMobile] = await Promise.all([
            User.findOne({ email: req.body.email }),
            User.findOne({ mobile: req.body.mobile })
        ]);
    
        if (userWithEmail || userWithMobile) {
            return res.status(400).json("Looks like you have already used this email or phone number earlier");
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash( req.body.password, salt);
    //this creates a user in mongodb.
    user = await User.create({
        Name:req.body.Name,
        email:req.body.email,
        mobile:req.body.mobile,
        password:hashedPassword
     })

     const dataThatWeWantToSend = {
        //_id is unique and its the fastest way of data retrival
        user:{
            //we are going to verify this id ===with User.finOne(_id)
            id:user.id
        }
     }
//jwt inbuilt sign method.
     const authToken =  jwt.sign(dataThatWeWantToSend, JWT_SECRET);
     res.json({authToken});
    } catch (error) {
        console.error(error.message);
        res.status(500).send("internal server error");
    }
     });

// Authenticate or login a existing user using POST method and does not require login ------------------------------------------ROUTE 2
router.post("/login",[
    check("email","invalid email").isEmail(),
    check("password","password cannot be empty").exists()
],async (req,res)=>{
 //if error with above conditions occur
 const errors = validationResult(req);
 if(!errors.isEmpty()){
     return res.status(400).json({errors:errors.array()});
 }
 //destructuring email and password form req.body of login form.
 const {email,password} = req.body;
 try {

    let user = await User.findOne({email});
    if(!user){
        return res.status(400).send("Inavalid login credentials");
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
      if(!passwordCompare){
        return res.status(400).send("Inavalid login credentials");
      }

    const dataThatWeWantToSend = {
        //_id is unique and its the fastest way of data retrival and id gives string value of _id
        user:{
            //we are going to verify this id ===with User.finOne(_id)
            id:user.id
        }
     }
//jwt inbuilt sign method.
     const authToken =  jwt.sign(dataThatWeWantToSend, JWT_SECRET);
     res.json({authToken});
    } catch (error) {
        console.error(error.message);
        res.status(500).send("internal server error");
    }
     });
// getuser user using POST method and does require login ------------------------------------------ROUTE 3
router.post("/getuser", fetchuser, async(req,res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password")
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("internal server error");
    }
})
     module.exports = router;