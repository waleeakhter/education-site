require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const ejs = require('ejs')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const static_path = path.join(__dirname, './public')
const reuseAble = require('./src/controllers/reuseable')
const sessions = require('express-session')
const moment = require('moment')
const twoDay = 60 * 60 * 48 * 1000
;(function () {
    var childProcess = require('child_process')
    var oldSpawn = childProcess.spawn
    function mySpawn() {
        console.log('spawn called')
        console.log(arguments)
        var result = oldSpawn.apply(this, arguments)
        return result
    }
    childProcess.spawn = mySpawn
})()

app.use(cookieParser())
app.use(
    sessions({
        secret: 'thisismysecrctekeyfhrgfgrfrty84fwir767',
        saveUninitialized: true,
        cookie: { maxAge: twoDay },
        resave: false,
    })
)

app.use(function (req, res, next) {
    res.locals.user = req.session.user
    res.locals.token = req.session.token
    res.locals.lastUrl = req.session.lastUrl
    res.locals.moment = moment
    next()
})

const reuseAbleValues = reuseAble.documentInfo()
reuseAbleValues.then((res) => {
    app.locals = res
})

const port = process.env.PORT || 5001
require('./src/db/conn')

app.use(express.static(static_path))
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

//routes
const userRoutes = require('./src/routes/user')
const planRoute = require('./src/routes/plans')
const fileRoute = require('./src/routes/file')
const searchRoute = require('./src/routes/search')
const paymentRoute = require('./src/routes/payment')

app.use('/', planRoute)
app.use('/', userRoutes)
app.use('/', fileRoute)
app.use('/', searchRoute)
app.use('/', paymentRoute)
app.get('*', function (req, res) {
    res.render('404')
})
// '192.168.0.87' || 'localhost'
app.listen(port, () => {
    console.log(`server is running at ports no ${port}`)
})
