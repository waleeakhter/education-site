const plansModel = require("../models/plans");
const docInfoRequest = require("./reuseable");

exports.plansView = async (req, res) => {
   const plans = await plansModel.find();
   res.render("plans" , {plans});
}


exports.indexView = (req, res) => {
   res.render("index")
}

