const universityModel = require('../models/university')
const courseTypeModel = require('../models/courseType')
const docTypeModel = require('../models/docType')
const planModel = require('../models/plans')

exports.seedUniversities = () => {
    const universities = [
        { name: 'King Abdulaziz University' },
        { name: 'University of Jeddah' },
        { name: 'KSAU-HS' },
        { name: 'University of Business and Technology' },
        { name: 'Dar Al-Uloom University' },
        { name: 'Umm Al-Qura University' },
        { name: 'Effat University' },
        { name: 'Dar Al-Hekma University' },
        { name: 'Taif University' },
        { name: 'Islamic University of Madina' },
        { name: 'Prince Mugrin University' },
        { name: 'King Saud University ' },
        { name: 'King Fahd University' },
        { name: 'Imam Abdulrahman Bin Faisal University' },
        { name: 'University College of Jubail' },
        { name: 'Prince Sultan University ' },
        { name: 'AlFaisal University' },
        { name: 'Majmaah University' },
        { name: 'Shaqra University' },
        { name: 'Jazan University' },
        { name: 'King Khalid University' },
        { name: 'Tabuk University Najran University' },
        { name: 'Al-Baha University' },
    ]

    universityModel.countDocuments({}, function (err, count) {
        console.log('Number of uni:', count)
        if (count === 0) {
            universityModel.insertMany(universities, function (error, docs) {
                console.log(error, docs)
            })
        }
    })
}

// course type
exports.seedCourseType = () => {
    const courseTypes = [
        { name: 'Math' },
        { name: 'Biology' },
        { name: 'Chemistry' },
        { name: 'Biochemistry' },
        { name: 'Engineering' },
        { name: 'Finance' },
        { name: 'Accounting' },
        { name: 'Business Management' },
        { name: 'Law' },
        { name: 'Computer Science' },
        { name: 'Medicine' },
        { name: 'Pharmacy' },
        { name: 'Physical Therapy' },
        { name: 'Radiology' },
        { name: 'Physics' },
        { name: 'Dentistry' },
        { name: 'Social Science' },
    ]
    courseTypeModel.countDocuments({}, function (err, count) {
        console.log('Number of course types:', count)
        if (count === 0) {
            courseTypeModel.insertMany(courseTypes, function (error, docs) {
                console.log(error, docs)
            })
        }
    })
}

// course type
exports.seedDocType = () => {
    const docTypes = [
        { name: 'Quiz' },
        { name: 'Test Prep' },
        { name: 'Exams' },
        { name: 'Lab' },
        { name: 'Homework' },
        { name: 'Notes' },
        { name: 'Other' },
    ]

    docTypeModel.countDocuments({}, function (err, count) {
        console.log('Number of documents types:', count)
        if (count === 0) {
            docTypeModel.insertMany(docTypes, function (error, docs) {
                console.log(error, docs)
            })
        }
    })
}

exports.seedPlan = () => {
    const plans = [
        { name: 'Annual', price: 9.95, views: 30, months: 12 },
        { name: 'Quarterly', price: 19.95, views: 30, months: 3 },
        { name: 'Monthly', price: 39.95, views: 30, months: 1 },
    ]

    planModel.countDocuments({}, function (err, count) {
        console.log('Number of palns :', count)
        if (count === 0) {
            planModel.insertMany(plans, function (error, docs) {
                console.log(error, docs)
            })
        }
    })
}
