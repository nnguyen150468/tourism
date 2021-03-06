const mongoose = require('mongoose')
const User = require('./user')
const Category = require('./category')
const Review = require('./review')
const Booking = require('./booking')
const AppError = require('../middlewares/appError')

const tourSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Tour's title is required"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Tour's description is required"],
        trim: true
    },
    categories: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "Category",
            required: [true, "Tour must have at least one category"]
        }
    ],
    organizer: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "Tour's organizer is required"]
    },
    guides: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: true
        }
    ],
    ratingAverage: {
        type: Number,
        default: 0,
        min: [0, "Rating must be above 0"],
        max: [5, "Rating must be below 5.0"],
        set: value => Math.round(value * 10) / 10
    },
    ratingQuantity: {
        type: Number,
        default: 0
    },
    duration: {
        type: Number,
        required: [true, "Tour must have duration"]
    },
    price: {
        type: Number,
        required: [true, "Tour must have a price"],
        min: [0, "Tour price must be at least 0 dollars"]
    },
    groupSize: {
        type: Number,
        required: [true, "You must indicate a group size"],
        min: [1, "Group size must be at least 1"]
    },
    availability: {
        type: Number,
        min: [0, "Minimum availablity is 0"]
    }
}, {
    timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})


tourSchema.pre("save", async function(next){
    if(!this.isModified("guides")) return next();
    const found = await User.find({"_id": {$in: this.guides}}).select("_id")
    console.log('found ======', this.guides)
    if(found.length!==this.guides.length)
        throw new Error("guide(s) doesn't exist")
    
    const guideArray = this.guides.map(async guide => await User.findById(guide))
    const categoryArray = this.categories.map(async category => await Category.findById(category))
    // console.log('this',this)
    // console.log('guideArray', guideArray)
    // console.log('this.categories', this.categories)
    
    this.guides = await Promise.all(guideArray)
    this.categories = await Promise.all(categoryArray)
    console.log('categoryArray',categoryArray)
    this.organizer = await User.findById(this.organizer)


    next()
})

tourSchema.post("findOneAndDelete", async function(next){
    await Review.deleteMany({tour: this._conditions._id})
})

tourSchema.virtual("reviews", {
    ref: "Review",
    localField: "_id",
    foreignField: "tour"
})

tourSchema.pre(/^find/, async function(next){
    this
        .populate("organizer guides", "_id name email")
        .populate("categories")
        // .populate("reviews", "content id rating")
    next()
})

// tourSchema.pre("save", async function(next){
//     const guideArray = this.guides.map(async guide => await User.findById(guide))
//     const categoryArray = this.categories.map(async category => await Category.findById(category))
//     this.guides = await Promise.all(guideArray)
//     this.categories = await Promise.all(categoryArray)
//     this.organizer = await User.findById(this.organizer)
//     next()
// })

tourSchema.methods.toJSON = function(){
    const tour = this;
    const tourObject = tour.toObject();
    delete tourObject.createdAt
    delete tourObject.updatedAt
    delete tourObject.__v
    delete tourObject.organizer.password
    delete tourObject.organizer.__v
    delete tourObject.organizer.tokens
    tourObject.guides.map(el=>delete el.tokens)
    tourObject.categories.map(el=>delete el.__v)
    tourObject.guides.map(guide=> {delete guide.password; delete guide.__v})
    if(!tourObject.reviews) return tourObject 
    tourObject.reviews.map(review=> delete review.tour)
    return tourObject
}

tourSchema.pre("save", async function(next){
    if(!this.isModified("groupSize"))
        next()
    
    const booked = await Booking.countBooking(this._id)
    this.availability = this.groupSize - booked;

    if(this.availablity < 0){
        return next(new AppError("Availability must be at least 0"))
    }
})

tourSchema.pre(/^findOneAndUpDate/, async function(next){
    console.log('this query========', this._conditions._id)
    if(!this._update.groupSize)
        next()
    
    const booked = await Booking.countBooking(this._conditions._id)
    
    this._update.availability = this._update.groupSize - booked;
    if(this._update.availability < 0){
        next(new AppError(400, "Availability must be at least 0"))
    }
    next()
})

const Tour = mongoose.model("Tour", tourSchema)

module.exports = Tour;

//pay with 4242 4242 4242 4242 