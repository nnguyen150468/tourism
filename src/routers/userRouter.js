const router = require('express').Router()
const {createUser, readUsers, updateUser, readMyProfile, resetPassword, changePassword} = require('../controllers/userController')
const { auth } = require('../controllers/authController')


router.route("/")
.post(createUser)
.get(readUsers)

//reset password
router.route("/forget-password/:email")
.get(resetPassword)

router.route("/update-password/:token")
.post(changePassword)

router.route("/me")
.patch(auth, updateUser)
.get(auth, readMyProfile)

module.exports = router;