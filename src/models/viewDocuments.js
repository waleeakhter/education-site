const mongoose = require('mongoose');
var ttl = require('mongoose-ttl');
var viewsDocumentsSchema = new mongoose.Schema({
    pdfId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'file',
        required: true
    },
    viewBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    expire_at: {
        type: Date,
        default: Date.now()
    }
});
viewsDocumentsSchema.plugin(ttl, { ttl: 172800000 });
module.exports = mongoose.model('viewsDocument', viewsDocumentsSchema);
