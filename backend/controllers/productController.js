const Product = require('../model/Product');
const cloudinary = require('../config/cloudinary');

// Get all products

const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.error('Get products error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

const getProductById = async (req, res) => {
    try {
        const productItem = await Product.findById(req.params.id);
        if (productItem) {
            res.json(productItem);
        }
        else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error('Get product error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;
        if (!name || !description || !price || !category || !stock) {
            return res.status(400).json({ message: 'All product fields are required' });
        }
        if (!req.file) {
            return res.status(400).json({ message: 'Product image is required' });
        }

        const result = await cloudinary.uploader.upload(req.file.path);
        const imageUrl = result.secure_url;

        const newProduct = new Product({
            name,
            description,
            price,
            category,
            stock,
            imageUrl
        });
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;
        const productItem = await Product.findById(req.params.id);
        if (productItem) {
            productItem.name = name || productItem.name;
            productItem.description = description || productItem.description;
            productItem.price = price || productItem.price;
            productItem.category = category || productItem.category;
            productItem.stock = stock || productItem.stock;
            if (req.file) {
                const result = await cloudinary.uploader.upload(req.file.path);
                productItem.imageUrl = result.secure_url;
            }
            const updatedProduct = await productItem.save();
            res.json(updatedProduct);
        }
        else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error('Update product error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const productItem = await Product.findById(req.params.id);
        if (productItem) {
            await productItem.deleteOne();
            res.json({ message: 'Product removed' });
        }
        else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error('Delete product error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
