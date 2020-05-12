const router = require('express').Router()
const {login, auth, logout} = require('../controllers/authController')

const {loginFacebook, facebookAuth} = require('../auth/facebookHandler')

const {loginGoogle, googleAuth} = require('../auth/googleHandler')

const {loginGithub, githubAuth} = require('../auth/githubHandler')


router.route("/login")
.post(login)

router.route("/logout")
.post(auth, logout)

router.route("/facebook")
.get(loginFacebook)

router.route("/facebook/authorized")
.get(facebookAuth)


router.route("/google")
.get(loginGoogle)

router.route("/google/authorized")
.get(googleAuth)

router.route("/github")
.get(loginGithub)

router.route("/github/authorized")
.get(githubAuth)

module.exports = router;