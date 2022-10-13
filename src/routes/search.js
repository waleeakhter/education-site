const express = require('express');
const router = express.Router();
const searchController = require('../controllers/search')

//Configuration for Multer


router.post("/search", searchController.homeSearch);

router.post("/filter", searchController.filterSearch);
module.exports = router