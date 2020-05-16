const mongoose = require('mongoose')


const schema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User", 
        required: [true, "Booking must have a userID"]
    }, 
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: "Tour", 
        required: [true, "Booking must have a tourID"]
    },
    paymentID: {
        type: String,
        default: null,
        required: [true, "Booking must have a paymentID"]
    },
    quantity: {
        type: Number,
        required: [true, "Booking must a quantity"],
        min: [1, "Quantity must be at least 1"]
    }, 
    total: {
        type: Number,
        required: [true, "Booking must have a total"],
        min: [0, "Booking must be at least 0"]
    },
    paid: {
        type: Boolean,
        default: false
    }
},  {
    timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})

schema.statics.countBooking = async function(tourId){
    const count = await this.aggregate([
        { $match: {tour: tourId}},
        { $group: {_id: "$tour", count: {$sum: "$quantity"}}}
    ])
    return count[0] ? count[0].count : 0
}

module.exports = mongoose.model("Booking", schema)