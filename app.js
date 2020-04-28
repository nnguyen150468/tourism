require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const router = express.Router()

const {createUser, readUsers, updateUser} = require('./src/controllers/userController')
const {login, auth, logout} = require('./src/controllers/authController')
const {createTour, readAllTours, readSingleTour, readMyTours, readToursOfCategory,
    deleteTour, updateTour} = require('./src/controllers/tourController')
const {checkTour, checkTourExist} = require('./src/middlewares/checkTour')
const {createReview, readReviews, 
    checkReview, deleteReview, updateReview} = require('./src/controllers/reviewController')
const {createCategory, getCategories, 
    deleteCategory, updateCategory} = require('./src/controllers/categoryController')


mongoose.connect(process.env.LOCAL_DB, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=> console.log("Successfully connected to database"))

app.use(bodyParser.urlencoded({extended: false})) //to what?
app.use(bodyParser.json()) //to make request json?
app.use(router)

router.route("/user")
.post(createUser)
.get(readUsers)
.patch(auth, updateUser)

router.route("/login")
.post(login)

router.route("/logout")
.post(auth, logout)

router.route("/myTours")
.get(auth, readMyTours)

router.route("/tours/:tourID/reviews/:reviewID")
.delete(auth, checkTourExist, checkReview, deleteReview)
.patch(auth, checkTourExist, checkReview, updateReview)

router.route("/tours/:tourID/reviews")
.post(auth, checkTourExist, createReview)
.get(checkTourExist, readReviews)

router.route("/tours/:tourID")
.delete(auth, checkTour, deleteTour)
.patch(auth, checkTour, updateTour)
.get(auth, checkTour, readSingleTour)

router.route("/tours")
.get(readAllTours)

router.route("/newTour")
.post(auth, createTour)

router.route("/categories/:categoryID/tours")
.get(readToursOfCategory)

router.route("/categories/:categoryID")
.delete(auth, deleteCategory)
.patch(auth, updateCategory)

router.route("/categories")
.post(auth, createCategory)
.get(getCategories)

app.listen(process.env.PORT, () => console.log("Listening to port",process.env.PORT))

