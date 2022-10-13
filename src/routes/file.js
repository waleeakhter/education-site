

const multer = require("multer");
const express = require('express');
const router = express.Router();




const fileController = require("../controllers/file");
router.get('/file', fileController.fileView)

const apiAuth = require('../middleware/apiAuth')
const auth = require('../middleware/authCheck')

//Configuration for Multer

const multerStorage = fileController.multerStorage;
const multerFilter = fileController.multerFilter;
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});


router.post("/uploadFile", apiAuth ,upload.single("uploaddoc"), fileController.fileSave );

router.get('/preview/:id', fileController.docPreview);


router.post("/documentView" , apiAuth , fileController.documentView);

router.get("/fullDocument/:id" , auth ,  fileController.fullDocument);






module.exports = router
