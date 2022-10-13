const mongoose = require('mongoose');
    const universitySchema = new  mongoose.Schema({
        name:{
            type: String,
            required: true,
            index: true
        }
    })
    
module.exports = mongoose.model("university" , universitySchema)