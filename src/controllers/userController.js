const User = require('../models/user')
const validator = require('validator')
const { readAll, updateOne } = require('./factories')
const catchAsync = require('../middlewares/catchAsync')
const AppError = require('../middlewares/appError')
const jwt = require('jsonwebtoken')

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

exports.resetPassword = catchAsync(async (req,res, next)=> {
    const {email} = req.params;
    if(!email) return next(new AppError(400, "Need to provide email"))

    const user = await User.findOne({email: email})
    if(!user) return res.status(200).json({
        status: "success",
        data: null
    })

    const token = jwt.sign({email: email}, process.env.SECRET,  {expiresIn:'15min'})

    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID);
    const msg = { 
        to: user.email,
        from: 'n.dinhnguyen95@gmail.com',
        subject: 'Reset password request',
        html: `Click <a href="https://localhost:3000/email/${token}">this link to reset your paswsword`
    }

    
    console.log('msg=====', msg)
    sgMail.send(msg);
    return res.status(200).json({
        status: "success",
        data: null
    })

})

exports.changePassword = catchAsync(async function(req, res, next){
    
    const {token} = req.params
    const {password} = req.body
    console.log('password ======', req.body)
    const decoded = jwt.verify(token, process.env.SECRET)
    
    const user = await User.findOne({email: decoded.email})
    user.password = password;
    
    await user.save()
    console.log('user PASSWORD=====', user)
    res.status(200).json({status: "success password", data: user})
})