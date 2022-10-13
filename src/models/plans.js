

const mongoose = require('mongoose');
    const PlanSchema = new  mongoose.Schema({
        name:{
            type: String,
            required: true,
            unique: true
        },
        price:{
            type: Number,
            required: true
        },
        views:{
            type: Number,
            required: true
        },months:{
            type: Number,
        }
    })
    
module.exports = mongoose.model("Plan" , PlanSchema)
