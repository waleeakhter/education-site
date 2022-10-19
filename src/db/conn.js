const mongoose = require('mongoose');

const seeders = require('./seeders')
mongoose.connect("mongodb+srv://waleed:W%40leed32@shalansports.fvjzwul.mongodb.net/?retryWrites=true&w=majority", {
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