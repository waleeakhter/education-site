

const mongoose = require('mongoose');
    const userSchema = new  mongoose.Schema({
        email:{
            type: String,
            required: true,
            unique: true
        },
        userName:{
            type: String,
            required: true
        },
        password:{
            type: String,
            required: true
        },
        token:{
                type: String,
                default: null
            },
        views :{
        type: Number,
        required: true,
        default: 5
        },
        planViews :{
        type: Number,
        required: true,
        default: 0
        },
        plan:{
            type: String,
            default:null
        },
        profileImage:{
            type: String,
            default:null
        }
    })
    
module.exports = mongoose.model("user" , userSchema)


   