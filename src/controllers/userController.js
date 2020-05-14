const User = require('../models/user')
const validator = require('validator')
const { readAll, updateOne } = require('./factories')
const catchAsync = require('../middlewares/catchAsync')


exports.createUser = catchAsync(async (req, res) => {
    try{
        const {name, email, password} = req.body;
        
        if(!password) throw new Error("You must enter a password")

        const user = new User({name, email, password})
        await user.save();
        
        return res.status(201).json({
            status: "success",
            data: user
        })
    } catch(err){
        return res.status(400).json({
            status: "failed",
            message: err.message
        })
    }
})

exports.readUsers = readAll(User)

exports.readMyProfile = (req, res) => {
    return res.status(200).json({
        status: "success",
        data: req.user
    })
}

// exports.readUsers = async (req, res) => {
//     try{
//         const users = await User.find();
//         return res.status(200).json({
//             status: "success",
//             data: users
//         })
//     } catch(err){
//         return res.status(400).json({
//             status: "failed",
//             message: err.message
//         })
//     }
// }


exports.updateUser = updateOne(User)

// exports.updateUser = async (req, res) => {
//     try{
//         console.log("validator.isEmail(req.body.email)", validator.isEmail(req.body.email))
//         const user = await User.findOneAndUpdate({_id: req.user._id}, 
//             {
//                 name: req.body.name? req.body.name: req.user.name,
//                 email: validator.isEmail(req.body.email)? req.body.email : req.user.email,
//                 password: req.body.password? req.body.password : req.user.password
//             },
//             {new: true})
//         return res.status(201).json({
//             status: "success",
//             data: user
//         })
//     } catch(err){
//         return res.status(401).json({
//             status: "failed",
//             message: err.message
//         })
//     }
// }