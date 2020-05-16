const router = require('express').Router({mergeParams: true})

const {createBooking} = require("../controllers/bookingController")

const {auth} = require('../controllers/authController')

const {checkTour} = require('../middlewares/checkTour')

router.route("/").post(auth, checkTour, createBooking)



module.exports = router;