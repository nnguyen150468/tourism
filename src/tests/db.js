const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const userOneId = new mongoose.Types.ObjectId;
const categoryOneId = new mongoose.Types.ObjectId;
const tourOneId = new mongoose.Types.ObjectId;

const userOne = {
    id: userOneId,
    name: "Khoa2",
    email: "khoa2@coder.vn",
    password: "123",
    age: 10,
    tokens: [jwt.sign({ id: userOneId }, process.env.SECRET) ]
}

const categoryOne = {
    id: categoryOneId,
    category: "Vietnam"
}

const tourOne = {
    id: tourOneId,
    title: "Vietnam",
    description: "safest place for corona",
    categories: [categoryOne.id],
    guides: [userOne.id],
    organizer: [userOne.id],
    duration: 7,
    price: 65
}

module.exports = { userOne, userOneId, categoryOne, categoryOneId, tourOne, tourOneId }