const User = require('../models/user')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require('fs');
// regsiter view
exports.registerView = (req, res) => {
   
      if(req.session.user){
         res.redirect("back")
      }
   res.render("register")
}


// register the user
exports.resgisterUser = async (req, res) => {
   
   
   try{
     
      if(req.query.url){
         req.session.lastUrl = req.query.url;
      }
      const hash = await bcrypt.hash(req.body.password, 10);
      const registerUser = new User({
         email:req.body.email,
         userName: req.body.username,
         password: hash,
      })
      
      const registered = await registerUser.save();
      res.json({statusText : 200});
   }catch(error){
      res.status(400).json(error);
   }
   
}

// login view

exports.loginView = async (req, res) => {
       if(req.session.user){
         res.redirect("back")
      }
      if(req.query.url){
         req.session.lastUrl = req.query.url;
      }
   res.render("login");
 

}
//login 

exports.loginUser = async (req, res) => {
   
   try{
      const email = req.body.email;
      const password = req.body.password;
      if(!req.body.email && !req.body.password){
         res.json({"message" : "Incorrect Credential"});
         return false;
      }

      const usercheck = await  User.findOne({ email: email});
     
     if(usercheck){
       
      const isMatch = await bcrypt.compare(password , usercheck.password)
    


         if (isMatch) {

           const createToken = jwt.sign(
               { user_id: usercheck._id, email }, "waleedakhterwaleedakhterwaleedakhterwaleedakhter",
               {
                  expiresIn: "48h",
               }
               );
            await User.updateOne({ _id: usercheck._id }, {$set: { token: createToken }});
            req.session.token = createToken;
              
            req.session.user = usercheck;
            res.json({"login": true})
         }else{
               res.json({"message" : "Incorrect Credential"});
           
         }
     }else{
      res.json({"message" : "Incorrect Credential"});
     }
         
      }catch(err){
         console.log(err)
         res.status(400).redirect("/login");
      }
      
   }
   
   
   
   
  
   
   
   

   
   
   exports.updateUser = async  (req, res) => {
      
      try {
         
         const userName = req.body.username;
         const oldPassword = req.body.oldpassword;
         const newPassword = req.body.newpassword;
         const confirmNewPassword = req.body.confirmnewpassword; 
         const user = req.session.user;
         let profileImage;
         let frontEndData = {};
         

         if (req.hasOwnProperty('file_error')) {
            res.json({"fileTypeErr" : req.file_error});
            return false;
         }

         if(req.file){
          profileImage = req.file.filename;}
         const checkPass = await  User.findOne({ _id: user._id});

         if(!userName){
            if(!oldPassword){
               res.json({"userNameReq" : true ,  "Message" : "Required field"});
               return false;
            }
         }

         if(oldPassword || newPassword || confirmNewPassword){
            if(!oldPassword){
               res.json({"oldPasswordReq" : true ,  "Message" : "Required field"});
               return false;
            }
            if(!newPassword){
               res.json({"newPasswordReq" : true ,  "Message" : "Required field"});
               return false;
            }

            if(!confirmNewPassword){
               res.json({"confirmNewPasswordReq" : true , "Message" : "Required field"});
               return false;
            }
         }

            
            
            if(oldPassword  ){
               if(oldPassword != newPassword) {

                  if(newPassword == confirmNewPassword){
                  const isMatch = await bcrypt.compare(oldPassword , checkPass.password);
                  if (!isMatch) {
                     res.json({"oldpassword" : false , "Message" : "Wrong Passowrd"});
                     return false;
                  }else {
                     const hash = await bcrypt.hash(confirmNewPassword, 10);
                     await User.updateOne({ _id: checkPass._id }, {$set: { password: hash }});
                  }
                  }else{
                     res.json({"passwordMisMatch" : false, "Message" : "Password Not Matched"});
                     return false;
                  }
               }else{
                  res.json({"PasswordSame" : true , "Message": "Old and New Password should not be same"});
                  return false;
               }

            }
         
         if(userName){
            const update = await User.updateOne({ _id: user._id }, {$set: { userName: userName }});
            req.session.user.userName = userName;
            frontEndData["userName"] = userName;
         }
        
         if(profileImage){
            
              
              await User.updateOne({ _id: checkPass._id }, {$set: { profileImage: profileImage }});
              req.session.user.profileImage = profileImage;
              frontEndData["profileImage"] = profileImage;
              
              if(checkPass.profileImage){
                 var data =fs.existsSync('./public/profiles'+checkPass.profileImage);
                 if(data){
                  fs.unlinkSync("public/profiles/"+checkPass.profileImage);
                 }
               }
         }
         res.setHeader('Content-Type', 'text/plain');
          res.json({"message" : true , "data" : frontEndData});
         
         
         
      } catch (error) {
         res.json(error)
         console.log(error);
      }
      
      
   }
  
   