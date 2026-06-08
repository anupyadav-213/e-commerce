const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const { createOrder, getOrders, myOrders, updateOrderStatus } = require('../controllers/orderController');

const router = express.Router();

// Create a new order
router.route('/').post(protect, createOrder).get(protect, admin, getOrders);

// Get order by ID
router.route('/myOrders').get(protect, myOrders);

// Get order by ID and update order status
router.route('/:id/status').put(protect, admin, updateOrderStatus);

module.exports = router;