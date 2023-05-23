const jwt = require("jsonwebtoken");

JWT_SECRET = "if i tell you it wont h@ppen";
const fetchuser = (req,res,next) =>{

const token = req.header("auth-token");
if(!token){
    res.status(401).send({error:"invalid Access"})
}
 try {
    const data = jwt.verify(token,JWT_SECRET)
    req.user = data.user;
      next();
 } catch (error) {
    res.status(401).send({error:"invalid Access"})
 }
}





module.exports = fetchuser;