const app = require('../../app')
const request = require('supertest')
const User = require('../models/user')
const Category = require('../models/category')
const Tour = require('../models/tour')
const {userOne, userOneId, categoryOne, categoryOneId, tourOne, tourOneId} = require('./db')

beforeEach( async() => { //run before any test
    await User.deleteMany() //make sure user doesn't exist already
    await new User(userOne).save()
    console.log('userOne', userOne)
    await Category.deleteMany()
    await new Category(categoryOne).save()
    console.log('categoryOne', categoryOne)
    // await Tour.deleteMany()
    // await new Tour(tourOne).save()
})

test("should NOT register an account", async() => {
    await request(app).post("/users/")
    .send({
        name: "Khoa", 
        email: "khoa@coder.vn" //need password
    }).expect(400) //need all info
})

test("should register an account", async()=> {
    await request(app).post("/users/")
    .send({
        name: "Khoa", 
        email: "khoa@coder.vn",
        password: "123"
    }).expect(201)
})

test("Should login user", async() => {
    await request(app).post("/auth/login")
    .send({
        email: "khoa2@coder.vn",
        password: "123"
    }).expect(200)
    .then(res => expect(res.body.data.email).toBe("khoa2@coder.vn"))
})

test("Should read my own profile", async() => {
    await request(app).get("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0]}`)
    .send()
    .expect(200)
})

test("Should see my tours", async()=>{
    await request(app).get("/tours/myTours")
    .set("Authorization", `Bearer ${userOne.tokens[0]}`)
    .send()
    .expect(200)
})

test("Should create tour", async() => {
    await request(app).post("/tours/newTour")
    .set("Authorization", `Bearer ${userOne.tokens[0]}`)
    .send({ 
        title: "Vietnam",
        description: "safest place for corona",
        categories: [categoryOne._id],
        guides: [userOne.id],
        // organizer: userOne._id,
        duration: 7,
        price: 65
    })
    .expect(201)
})

// test("Should delete tour", async() => {
//     await request(app).delete(`/tours/${tourOne._id}`)
//     .set("Authorization", `Bearer ${userOne.tokens[0]}`)
//     .send()
//     .expect(204)
// })