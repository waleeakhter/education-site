const mongoose = require('mongoose');

const seeders = require('./seeders')
mongoose.connect("mongodb+srv://waleedakhter:waleed123@educational.mkbae.mongodb.net/educational?retryWrites=true&w=majority&ssl=true", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {

    console.log("connection successful");

    seeders.seedUniversities();
    seeders.seedCourseType();
    seeders.seedDocType();
    seeders.seedPlan();

}).catch((e) => {
    console.log("not connected" + e);
})