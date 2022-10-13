const express = require('express')
const router = express.Router()
const userController = require('../controllers/user')
const auth = require('../middleware/authCheck')
const apiAuth = require('../middleware/apiAuth')
const path = require('path')
const multer = require('multer')
const uuid = require('uuid')
const userModel = require('../models/user')
const viewDocModel = require('../models/viewDocuments')
const mongoose = require('mongoose')
const fileModel = require('../models/file')
const planModel = require('../models/plans')

router.get('/register', userController.registerView)

// create new user
router.post('/api/register', userController.resgisterUser)

router.get('/login', userController.loginView)

router.post('/login', userController.loginUser)

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/profiles/')
  },
  filename: function (req, file, cb) {
    const fullName =
      req.session.user.userName.replace(/\s/g, '') +
      uuid.v4().replace(/-/g, '') +
      path.extname(file.originalname)
    cb(null, fullName)
  },
})

const upload = multer({
  storage: storage,
  limits: { fileSize: 2000000 },
  fileFilter: function (req, file, cb) {
    const fileTypes = /png|jpeg|jpg/
    const extName = fileTypes.test(path.extname(file.originalname))
    file.originalname.toLowerCase()
    const mimeType = fileTypes.test(file.mimetype)
    if (extName && mimeType) {
      cb(null, true)
    } else {
      req.file_error = 'File Type Not Supported use (png | jpeg | jpg)'

      cb(null, false)
    }
  },
}).single('profile_image')

router.post('/updateUser', apiAuth, upload, userController.updateUser)

router.get('/userprofile', auth, async (req, res) => {
  const user = req.session.user
  const objectId = mongoose.Types.ObjectId(user._id)
  let selectedPlan = ''
  const getFiles = await fileModel
    .find({ uploadBy: objectId })
    .populate(['docType'])
    .populate('courseType')
    .populate('university')

  const getViewDoc = await viewDocModel
    .find({ viewBy: objectId })
    .populate('pdfId')

  if (req.session.user.plan !== '' || req.session.user.plan !== null) {
    const plan = await planModel.findOne({ name: req.session.user.plan })
    selectedPlan = plan
    console.log(selectedPlan)
  }

  const planRoute = { getFiles, selectedPlan, getViewDoc }
  console.log(planRoute)
  res.render('profile', { planRoute })
})

router.get('/logout', async (req, res) => {
  if (req.session.user) {
    const user = req.session.user
    await userModel.updateOne({ _id: user._id }, { $set: { token: '' } })
    req.session.destroy()
  }
  res.redirect('/')
})

module.exports = router
