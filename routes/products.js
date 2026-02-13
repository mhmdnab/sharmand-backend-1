const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Product = require('../models/Product');

// @route   GET api/products
// @desc    Get all products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/products
// @desc    Create a product
// @access  Private (for admin)
router.post('/', auth, async (req, res) => {
  const { name, price, description, image } = req.body;

  try {
    const newProduct = new Product({
      name,
      price,
      description,
      image,
    });

    const product = await newProduct.save();
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/products/:id
// @desc    Update a product
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { name, price, description, image } = req.body;

  // Build product object
  const productFields = {};
  if (name) productFields.name = name;
  if (price !== undefined) productFields.price = price;
  if (description) productFields.description = description;
  if (image) productFields.image = image;

  try {
    let product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ msg: 'Product not found' });

    product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: productFields },
      { new: true }
    );

    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/products/:id
// @desc    Delete a product
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    console.log('DELETE request for product ID:', req.params.id);

    let product = await Product.findById(req.params.id);

    if (!product) {
      console.log('Product not found:', req.params.id);
      return res.status(404).json({ msg: 'Product not found' });
    }

    await Product.findByIdAndDelete(req.params.id);
    console.log('Product deleted successfully:', req.params.id);

    res.json({ msg: 'Product removed', success: true });
  } catch (err) {
    console.error('Error deleting product:', err.message);
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
});

module.exports = router;
