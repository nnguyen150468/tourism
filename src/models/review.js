const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, "Review's content is required"],
        trim: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "Reviewer is required"]
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: "Tour",
        required: [true, "You must specify the tour"]
    },
    rating: {
        type: Number,
        required: [true, "Rating is required"],
        min: 1,
        max: 5  
    }
}, {
    timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})

reviewSchema.pre(/^find/, function(next){
    this
        .populate("user", "_id name email")
        .populate("tour", "_id title description organizer")
    next()
})

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;