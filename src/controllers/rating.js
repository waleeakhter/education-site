const ratingModel = require('../models/rating');

exports.ratingController = async function (req, res) {
    var obj = {};

    try {
        const checkRating = await ratingModel.findOneAndUpdate(
            { pdfId: req.body.id, userId: req.session.user._id },
            {
                like: req.body.radtingType,
                userId: req.session.user._id,
                pdfId: req.body.id
            },
            { upsert: true, new: true }
        );

        const countLikes = await ratingModel.countDocuments({
            pdfId: req.body.id,
            like: true
        });
        const countDisLikes = await ratingModel.countDocuments({
            pdfId: req.body.id,
            like: false
        });

        let totalLikes = countLikes;
        let totalDisLikes = countDisLikes;

        res.json({ likes: totalLikes, disLikes: totalDisLikes });
    } catch (e) {
        console.log(e);
    }
};
