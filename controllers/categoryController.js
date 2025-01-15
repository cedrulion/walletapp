const Category = require('../models/Category');
const asyncHandler = require('../middleware/asyncHandler');

// Get all categories
const getCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find();
    res.json(categories);
});

// Create a category
const createCategory = asyncHandler(async (req, res) => {
    const { name, subcategories } = req.body;
    const category = new Category({ name, subcategories });
    await category.save();
    res.status(201).json(category);
});

module.exports = { getCategories, createCategory };
