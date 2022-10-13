const mongoose = require('mongoose');
    const docType = new  mongoose.Schema({
        name:{
            type: String,
            required: true,
            index: true
        }
    })
    
module.exports = mongoose.model("docType" , docType)
