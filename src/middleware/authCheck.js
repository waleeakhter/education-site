const jwt = require("jsonwebtoken");
const userModel = require("../models/user");


let  user;
const auth = async (req, res, next) => {
    try {
        const token =  req.session.token;
        const verifyUser = jwt.verify(token , "waleedakhterwaleedakhterwaleedakhterwaleedakhter");
        if(verifyUser){
          next()
        }
    }catch(err){
        console.log(err);
        res.status(401).redirect("/login");
    }
}


module.exports =  auth , user;


