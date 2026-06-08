const Order = require('../model/order');

const sendEmail = require('../utils/sendEmail');

// Create a new order
const createOrder = async (req, res) => {
    try {
        const { products, totalAmount, address, street, city, state, postalCode, country, paymentId } = req.body;

        if (!products || products.length === 0 || !totalAmount || !address || !street || !city || !state || !postalCode || !country) {
            return res.status(400).json({ message: 'Invalid order data' });
        }
        else {
            const newOrder = new Order({
                user: req.user._id,
                products,
                totalAmount,
                address,
                street,
                city,
                state,
                postalCode,
                country,
                paymentId
            });
            await newOrder.save();
            const message = `Dear ${req.user.name},\n\nThank you for your order!. Your order has been sucessfully created with the following details:\n\nOrder ID: ${newOrder._id}\nTotal Amount: $${totalAmount}\nShipping Address: ${address}\n\nWe will notify you once your order is shipped.\n\nBest regards,\nShopNest Team`;

            try {
                await sendEmail(req.user.email, 'Order Created', message);
            } catch (emailError) {
                console.error('Order created, but email failed:', emailError.message);
            }

            res.status(201).json({message: 'Order created successfully', order: newOrder});
        }
    } catch (error) {
        res.status(500).json({ message: 'Error creating order', error});
    }
};

const myOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).populate('products.product', 'name price');
        res.json(orders);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error });
    }
};

const getOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('user', 'id name')
        res.json(orders);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);
        if (order) {
            order.status = status;
            await order.save();
            res.json({ message: 'Order status updated', order });
        }
        else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating order status', error });
    }
};

module.exports = { createOrder, myOrders, getOrders, updateOrderStatus };
