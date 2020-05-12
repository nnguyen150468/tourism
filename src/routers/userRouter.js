const router = require('express').Router()
const {createUser, readUsers, updateUser, readMyProfile} = require('../controllers/userController')
const { auth } = require('../controllers/authController')

router.route("/")
.post(createUser)
.get(readUsers)

router.route("/me")
.patch(auth, updateUser)
.get(auth, readMyProfile)

module.exports = router;