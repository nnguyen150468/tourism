const mongoose = require('mongoose')
const AppError = require('../middlewares/appError')

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

// reviewSchema.pre(/^find/, function(next){
//     this
//         .populate("user", "_id name email")
//         .populate("tour", "_id title description organizer")
//     next()
// })


reviewSchema.statics.calculateAvgRating = async function(tourID){
    console.log('tourID', tourID)
    const stats = await this.aggregate([ //this in statics = class (Review)
        {
            $match: {tour: tourID} //find all reviews has tourID
        },
        {
            $group: { //make a group with these 3 fields
                _id: "$tour", //id for group, take value of tour field
                ratingQuantity: {$sum: 1}, //each review add 1 to sum
                ratingAverage: {$avg: "$rating"} //get avg of rating field
            }
        }
    ]);
    
    console.log('stats',stats)

    //save to database
    await mongoose.model("Tour").findByIdAndUpdate(tourID, {
        ratingQuantity: stats.length === 0 ? 0 : stats[0].ratingQuantity,
        ratingAverage: stats.length === 0 ? 0 : stats[0].ratingAverage
    })
}

reviewSchema.post("save", function(){
    this.constructor.calculateAvgRating(this.tour)
})

reviewSchema.pre(/^findOneAnd/, async function(next){
    this.doc = await this.findOne()
    console.log('this.doc',this.doc)
    if(!this.doc) return next(new AppError(404, "Review not found"))
    next()
})

reviewSchema.post(/^findOneAnd/, async function(){
    await this.doc.constructor.calculateAvgRating(this.doc.tour)
})
// reviewSchema.post(/^findOneAnd/, async function(){
    
// })

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;