const Category = require('../models/category')

exports.createCategory = async (req, res) => {
    try{
        const category = new Category({...req.body})
        await category.save()
        return res.status(201).json({
            status: "success",
            data: category
        })
    } catch(err){
        return res.status(400).json({
            status: "succes",
            message: err.message
        })
    }
}

exports.getCategories = async (req, res) => {
    try{
        const categories = await Category.find();
        return res.status(200).json({
            status: "success",
            data: categories
        })
    } catch(err){
        return res.status(400).json({
            status: "failed",
            message: err.message
        })
    }
}

exports.deleteCategory = async (req, res) => {
    try{
        await Category.findByIdAndDelete(req.params.categoryID)
        return res.status(204).json({
            status: "success",
            data: null
        })
    } catch(err){
        return res.status(401).json({
            status: "failed",
            message: err.message
        })
    }
}

exports.updateCategory = async (req, res) => {
    try{
        const category = await Category.findByIdAndUpdate(req.params.categoryID, 
            {...req.body},
            {new: true})
        return res.status(201).json({
            status: "success",
            data: category
        })
    } catch(err){
        return res.status(401).json({
            status: "failed",
            message: err.message
        })
    }
}