const express = require('express');
const router = express.Router();
const payment = require('../controllers/payment')

//Configuration for Multer


router.post("/payment", payment.payment);
module.exports = router