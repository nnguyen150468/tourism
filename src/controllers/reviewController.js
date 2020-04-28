const Review = require('../models/review')

exports.createReview = async (req, res) => {
    try{
        const review = await Review.findOneAndUpdate(
            {user: req.user._id, tour: req.params.tourID},
            {...req.body, user: req.user._id, tour: req.params.tourID},
            {upsert: true, new: true, setDefaultsOnInsert: true}
            )
        return res.status(201).json({
            status: "success",
            data: review
        })
    } catch(err){
        return res.status(401).json({
            status: "failed",
            message: err.message
        })
    }
}

exports.readReviews = async (req, res) => {
    try{
        const reviews = await Review.find({tour: req.params.tourID})
        return res.status(200).json({
            status: "success",
            data: reviews
        })
    } catch(err){
        return res.status(401).json({
            status: "failed",
            message: err.message
        })
    }
}

exports.deleteReview = async (req, res) => {
    try{
        await Review.findByIdAndDelete(req.params.reviewID);
        return res.status(204).json({
            status: "success",
            data: null
        })
    } catch(err){
        return res.status(401).json({
            status: "failed",
            message: err.message
        })
    }
}

exports.checkReview = async (req, res, next) => {
    try{
        const review = await Review.findOne(
            {user: req.user._id, tour: req.params.tourID, _id: req.params.reviewID})
        if(!review) throw new Error("Review not found")
        if(req.user._id.toString() !== review.user._id.toString()) throw new Error("You can only modify your reviews")
        next()
    } catch(err){
        return res.status(401).json({
            status: "failed",
            message: err.message
        })
    }
}

exports.updateReview = async (req, res) => {
    try{
        const updatedReview = await Review.findOneAndUpdate(
            {user: req.user._id, tour: req.params.tourID, _id: req.params.reviewID},
            {...req.body},
            {new: true})
        return res.status(201).json({
            status: "success",
            data: updatedReview
        })
    } catch(err){
        return res.status(201).json({
            status: "failed",
            message: err.message
        })
    }
}