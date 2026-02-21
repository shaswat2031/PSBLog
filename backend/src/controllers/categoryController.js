const Category = require('../models/Category');
const { formatResponse } = require('../utils/helpers');

/**
 * Get all categories
 * GET /api/categories
 */
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 });
        res.json(formatResponse(true, 'Categories retrieved successfully', categories));
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json(formatResponse(false, 'Failed to retrieve categories'));
    }
};

/**
 * Create new category (Admin only)
 * POST /api/categories
 */
const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name) {
            return res.status(400).json(formatResponse(false, 'Category name is required'));
        }

        const existingCategory = await Category.findOne({ name: name.trim() });
        if (existingCategory) {
            return res.status(400).json(formatResponse(false, 'Category already exists'));
        }

        const category = new Category({
            name: name.trim(),
            description: description ? description.trim() : ''
        });

        await category.save();
        res.status(201).json(formatResponse(true, 'Category created successfully', category));
    } catch (error) {
        console.error('Create category error:', error);
        res.status(500).json(formatResponse(false, 'Failed to create category'));
    }
};

/**
 * Update category (Admin only)
 * PUT /api/categories/:id
 */
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json(formatResponse(false, 'Category not found'));
        }

        if (name) category.name = name.trim();
        if (description !== undefined) category.description = description.trim();

        await category.save();
        res.json(formatResponse(true, 'Category updated successfully', category));
    } catch (error) {
        console.error('Update category error:', error);
        res.status(500).json(formatResponse(false, 'Failed to update category'));
    }
};

/**
 * Delete category (Admin only)
 * DELETE /api/categories/:id
 */
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByIdAndDelete(id);

        if (!category) {
            return res.status(404).json(formatResponse(false, 'Category not found'));
        }

        res.json(formatResponse(true, 'Category deleted successfully'));
    } catch (error) {
        console.error('Delete category error:', error);
        res.status(500).json(formatResponse(false, 'Failed to delete category'));
    }
};

module.exports = {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
};
