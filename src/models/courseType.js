const mongoose = require('mongoose');
    const courseType = new  mongoose.Schema({
        name:{
            type: String,
            required: true,
            index: true
        }
    })
    
module.exports = mongoose.model("courseType" , courseType)