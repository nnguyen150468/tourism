const router = require('express').Router({mergeParams: true})
const { auth } = require('../controllers/authController')
const { checkTourExist} = require('../middlewares/checkTour')

const {createReview, readReviews, 
    checkReview, deleteReview, updateReview} = require('../controllers/reviewController')

router.route("/:reviewID")
.delete(auth, checkTourExist, checkReview, deleteReview)
.patch(auth, checkTourExist, checkReview, updateReview)

router.route("/")
.post(auth, checkTourExist, createReview)
.get(checkTourExist, readReviews)

module.exports = router;