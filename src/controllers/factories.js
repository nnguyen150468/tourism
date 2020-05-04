const AppError = require('../middlewares/appError')
const catchAsync = require('../middlewares/catchAsync')

exports.deleteOne = Model => catchAsync(async (req, res) => {
    let id;
    switch(Model.modelName){
        case 'Tour':
            id = req.params.tourID
            break;
        case 'Review':
            id = req.params.reviewID
            break;
        default:
            id = req.params.id
    }
    await Model.findOneAndDelete({_id: id})
    
    if(!id) return next(new AppError(400, "There is no such item"))

    res.status(204).end()
})

// function(Model => {return (req,res)})
exports.updateOne = Model => catchAsync(async (req, res) => {
    let id;
    let allows = []
    switch(Model.modelName){
        case 'Tour':
            id = req.params.tourID
            allows = ['title', 'description', 'guides']
            break;
        case 'Review':
            id = req.params.reviewID
            allows = ['rating', 'content']
            break;
        case 'User':
            allows = ['password']
            id = req.user._id
            break;
        default:
            id = req.params.id
    }
    Object.keys(req.body).forEach(el => {
        if(!allows.includes(el))
        delete req.body[el]
    })
    
    const newItem = await Model.findOneAndUpdate({_id: id},
        req.body, //use the same keys, {...req.body} creates new object
        { new: true})

    res.status(201).json({status: "OK", data: newItem})
})

exports.readOne = Model => catchAsync(async (req, res, next) => {
    let id;
    switch(Model.modelName){
        case 'Tour':
            id = req.params.tourID
            break;
        case 'Review':
            id = req.params.reviewID
            break;
        case 'User':
            id = req.user._id
            break;
        default:
            id = req.params.id
    }

    if(!id) return next(new AppError(400, "Not found"))

    const item = await Model.findOne({_id: id});
    return res.status(200).json({
        status: "OK",
        data: item
    })
})

exports.readAll = Model => catchAsync(async (req, res, next) => {
    const items = await Model.find();

    if(!items) return next(new AppError(400, "Not found"))

    return res.status(200).json({
        status: "OK",
        data: items
    })
})