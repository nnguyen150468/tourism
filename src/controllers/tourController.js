const Tour = require('../models/tour')
const Review = require('../models/review')
const AppError = require('../middlewares/appError')
const { deleteOne, updateOne, readAll } = require('./factories')
const catchAsync = require('../middlewares/catchAsync')

exports.createTour = async (req, res) => {
    try{
        console.log('req.body', req.body)
        const tour = new Tour({
            ...req.body,
            organizer: req.user._id
        })
        
        await tour.save();
        
        console.log('tour')
        return res.status(201).json({
            status: "success",
            data: tour
        })
    } catch(err){
        return res.status(401).json({
            status: "failed ha",
            message: err.message
        })
    }
}

exports.readAllTours = readAll(Tour)

exports.readFilterTours = catchAsync(async (req, res, next) => {
    const filters = {...req.query}
    const paginationKeys = ['limit', 'page', 'sort'];
    paginationKeys.map(el => delete filters[el])
    console.log('filters', filters)

    // let query = Tour.find({})
    console.log('req.query', req.query)

    // const filterTours = await Tour.find(filters);
    
    const filterTours = Tour.find(filters);
    const countTours = await Tour.find(filters).countDocuments()

    if(req.query.sort){
        let sortBy = req.query.sort.split(',').join(" ")
        filterTours.sort(sortBy)
    }

    if(req.query.page || req.query.limit){
        const page = req.query.page*1 || 1
        const limit = req.query.limit*1 || 2
        const skip = (page - 1)*limit
        filterTours.skip(skip).limit(limit)

        if(req.query.page && skip > countTours){
            return next(new AppError(400, "Page number out of range"))
        }
    }


    

    const sortedResult = await filterTours;

    res.json({
        status: "success",
        data: sortedResult
    })
    
})

// exports.deleteTour = async (req, res) => {
//     try{
//         await Tour.findByIdAndDelete(req.tour._id)
//         return res.status(201).json({
//             status: "success",
//             data: null
//         })
//     } catch(err){
//         return res.status(401).json({
//             status: "failed",
//             message: err.message
//         })
//     }
// }

exports.deleteTour = deleteOne(Tour)

// exports.updateTour = async (req, res) => {
//     try{
//         console.log('req.tour',req.tour.categories)
//         const updatedTour = await Tour.findByIdAndUpdate(req.params.tourID, 
//             {
//             //if user fill in nothing, it will keep the original data
//             title: !req.body.title ? req.tour.title : req.body.title,
//             description: !req.body.description ? req.tour.description : req.body.description,
//             categories: !req.body.categories ? req.tour.categories.map(el => el._id) : req.body.categories,
//             guides: !req.body.guides ? req.tour.guides.map(el => el._id) : req.body.guides
//             // ...req.body
//         },
//         {new: true})
//         console.log('updatedTour', updatedTour)
//         return res.status(201).json({
//             status: "success",
//             data: updatedTour
//         })
//     } catch(err){
//         return res.status(401).json({
//             status: "failed",
//             message: err.message
//         })
//     }
// }

exports.updateTour = updateOne(Tour)

exports.readSingleTour = async (req, res) => {
    try{
        const singleTour = await Tour.findById(req.params.tourID)
            .populate("reviews", "_id content rating user")
        return res.status(200).json({
            status: "success",
            data: singleTour
        })
    } catch(err){
        return res.status(401).json({
            status: "failed",
            message: err.message
        })
    }
}

exports.readMyTours = async (req, res) => {
    try{
        const myTours = await Tour.find({organizer: req.user})
        return res.status(200).json({
            status: "success",
            data: myTours
        })
    } catch(err){
        return res.status(401).json({
            status: "failed",
            message: err.message
        })
    }
}

exports.readToursOfCategory = async (req, res) => {
    try{
        const tours = await Tour.find({categories: {$in: req.params.categoryID}})
        console.log('tours',tours)
        if(!tours) throw new Error("No tour of this category")
        return res.status(200).json({
            status: "success",
            data: tours
        })
    } catch(err){
        return res.status(400).json({
            status: "failed",
            message: err.message
        })
    }
}