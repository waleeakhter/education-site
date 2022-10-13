const fileModel = require('../models/file')
const userModel = require('../models/user')
const viewDocModel = require('../models/viewDocuments')
const fs = require('fs')

const multer = require('multer')
const ratingModel = require('../models/rating')
// const pdf2image = require("./pdftoimage")
const { fromPath } = require('pdf2pic')

// Router of File View

exports.fileView = async (req, res) => {
    const files = await fileModel.find()

    res.render('browsingfile', { files })
}

// multer filer

exports.multerFilter = (req, file, cb) => {
    if (file.mimetype.split('/')[1] === 'pdf') {
        cb(null, true)
    } else {
        req.pdfError = 'Only Pdf File Supported'
        cb(null, false)
    }
}

// multer storage

exports.multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public')
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1]
        cb(null, `pdfs/${Date.now()}-${file.originalname}`)
    },
})

// file save

exports.fileSave = async (req, res) => {
    try {
        const user = req.session.user
        let pdfSingleImage = ''
        let newFile
        let saveFile
        const ImageName = req.file.filename.split('.').slice(0, -1).join('.')
        console.log(req)
        if (req.hasOwnProperty('pdfError')) {
            res.json({ pdfError: req.pdfError })
            return false
        }
        // pdf to image
        // const getFileTest =   pdf2image.pdf2Image('public/'+req.file.filename, {out_dir:'public/', out_prefix:ImageName});

        const options = {
            density: 100,
            saveFilename: ImageName,
            savePath: 'public',
            format: 'png',
            width: 1024,
            height: 1024,
            quality: 100,
        }
        const storeAsImage = fromPath('public/' + req.file.filename, options)
        const pageToConvertAsImage = 1

        storeAsImage(pageToConvertAsImage).then((resolve) => {
            console.log('Page 1 is now converted as image')

            return resolve
        })

        // save file to DB
        newFile = await fileModel.create({
            name: req.body.docname,
            file: req.file.filename,
            pdfImage: ImageName + '.1.png',
            docType: req.body.doctype,
            courseType: req.body.course_type,
            university: req.body.university,
            uploadBy: user._id,
        })

        saveFile = await newFile.save()

        // add one view to user
        if (saveFile) {
            const addView = user.views + 1
            req.session.fileUpload = 'true'
            await userModel.updateOne(
                { _id: user._id },
                { $set: { views: addView } }
            )
            req.session.user.views = addView
        }
        res.json(200)
    } catch (error) {
        res.json(401)
    }
}

// document preview page route
exports.docPreview = async (req, res) => {
    const getFile = await fileModel
        .findOne({ _id: req.params.id })
        .populate(['docType'])
        .populate('courseType')
        .populate('university')
        .populate({ path: 'uploadBy', select: 'userName -_id' })

    const countLikes = await ratingModel.countDocuments({
        pdfId: getFile._id,
        like: true,
    })
    const countDisLikes = await ratingModel.countDocuments({
        pdfId: getFile._id,
        like: false,
    })

    let totalLikes = countLikes
    let totalDisLikes = countDisLikes

    res.render('docpreview', { getFile, totalLikes, totalDisLikes })
}

// document view checks

exports.documentView = async (req, res) => {
    try {
        const user = req.session.user
        const pdfId = req.body.id

        console.log(user)

        //check file upload by loged in user or not
        const checkFileUpload = await fileModel.findOne({
            _id: pdfId,
            uploadBy: user._id,
        })

        //check user already viewed is document or not
        const checkDoc = await viewDocModel.findOne({
            pdfId: pdfId,
            viewBy: user._id,
        })

        if (checkFileUpload) {
            res.json({ userOwnDoc: true })
        } else if (checkDoc) {
            res.json({ alreadyViewed: true })
        } else {
            if (user.views > 0) {
                const ViewedDoc = await viewDocModel.create({
                    pdfId: pdfId,
                    viewBy: user._id,
                })

                const saveDoc = await ViewedDoc.save()

                const views = await userModel.updateOne(
                    { _id: user._id },
                    { $set: { views: user.views - 1 } }
                )

                user.views = user.views - 1

                res.json({ Userviews: true })
            } else if (user.planViews > 0) {
                const ViewedDoc = await viewDocModel.create({
                    pdfId: pdfId,
                    viewBy: user._id,
                })
                const saveDoc = await ViewedDoc.save()

                const views = await userModel.updateOne(
                    { _id: user._id },
                    { $set: { planViews: user.planViews - 1 } }
                )

                user.planViews = user.planViews - 1

                res.json({ Userviews: true })
            } else {
                res.json({ Userviews: 0 })
            }
        }
    } catch (e) {
        console.log(e)
    }
}

/// preview full document

exports.fullDocument = async (req, res) => {
    try {
        const user = req.session.user
        const pdfId = req.params.id

        const getFile = await fileModel.findOne({ _id: pdfId })
        res.render('fulldocument', { getFile })
    } catch (e) {
        console.log(e)
    }
}
