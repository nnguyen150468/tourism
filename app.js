require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const router = express.Router()


const { auth } = require('./src/controllers/authController')

// const {createCategory, getCategories, 
//     deleteCategory, updateCategory} = require('./src/controllers/categoryController')

const userRouter = require('./src/routers/userRouter')
const authRouter = require('./src/routers/authRouter')
const tourRouter = require('./src/routers/tourRouter')
const reviewRouter = require('./src/routers/reviewRouter')

const { errorController } = require('./src/middlewares/errorController') 
const AppError = require('./src/middlewares/appError')

mongoose.connect(process.env.LOCAL_DB, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=> console.log("Successfully connected to database"))

app.use(bodyParser.urlencoded({extended: false})) //to what?
app.use(bodyParser.json()) //to make request json?
app.use(router)

// router.route("/").get((req, res) => {res.send("ok")})

router.use("/users", userRouter)

router.use("/tours/:tourID/reviews", reviewRouter)

router.use("/tours", tourRouter)

router.use("/auth", authRouter)

//404 handler
function notFound(req, res, next){
    next(new AppError(404, "URL Not Found"))
}

router.route("*").all(notFound)

app.use(errorController)



// router.route("/categories/:categoryID/tours")
// .get(readToursOfCategory)


// router.route("/categories/:categoryID")
// .delete(auth, deleteCategory)
// .patch(auth, updateCategory)

// router.route("/categories")
// .post(auth, createCategory)
// .get(getCategories)

app.listen(process.env.PORT, () => console.log("Listening to port",process.env.PORT))

