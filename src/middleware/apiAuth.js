const jwt = require("jsonwebtoken");
const userModel = require("../models/user");



const auth = async (req, res, next) => {
    
    try {
        let  user  = req.session.user;
        console.log(user)
        const token =  req.header('Authorization').replace(/^Bearer\s/, '');
       
        const verifyUser = jwt.verify(token , "waleedakhterwaleedakhterwaleedakhterwaleedakhter");
        if(verifyUser && user ){
          next()
        }else{
            throw new Error
        }
    }catch(err){
        console.log(err);
        res.status(401).send("Unathorized");
    }
}


module.exports =  auth;