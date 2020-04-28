const mongoose = require('mongoose')
const User = require('./user')
const Category = require('./category')

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
    ]
}, {
    timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})


tourSchema.pre("save", async function(next){
    if(!this.isModified("guides")) return next();
    const found = await User.find({"_id": {$in: this.guides}}).select("_id")
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

tourSchema.virtual("reviews", {
    ref: "Review",
    localField: "_id",
    foreignField: "tour"
})

tourSchema.pre(/^find/, async function(next){
    this
        .populate("organizer guides", "_id name email")
        .populate("categories")
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
    return tourObject
}

const Tour = mongoose.model("Tour", tourSchema)

module.exports = Tour;