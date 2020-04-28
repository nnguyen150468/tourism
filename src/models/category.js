const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    category: {
        type: String,
        required: [true, "You must enter category"],
        unique: true,
        trim: true
    }
})

const Category = mongoose.model("Category", categorySchema);

module.exports = Category