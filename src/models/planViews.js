const mongoose = require('mongoose')
var ttl = require('mongoose-ttl')
var planViewsSchema = new mongoose.Schema({
    planViews: {
        type: Number,
        required: true,
    },
    planName: {
        type: String,
    },
    buyBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    created_at: {
        type: Date,

        default: Date.now(),
    },
    expirationDate: {
        type: Date,
        expires: 0,
    },
})
// planViewsSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 })
// planViewsSchema.plugin(ttl, { ttl: 172800000 })
module.exports = mongoose.model('planViews', planViewsSchema)
