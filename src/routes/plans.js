const express = require('express');
const router = express.Router({mergeParams: true});

const plansController = require('../controllers/plans');
const userModel = require('../models/user');
const auth = require('../middleware/authCheck');
const apiAuth = require('../middleware/apiAuth')

const ratingController = require('../controllers/rating')



router.get('/plans',auth , plansController.plansView );

router.get('/', plansController.indexView);












router.post('/rating' , apiAuth, ratingController.ratingController );

module.exports = router