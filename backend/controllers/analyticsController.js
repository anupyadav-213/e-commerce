const order = require('../model/order');
const Product = require('../model/Product');
const User = require('../model/user');

const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({role: 'user'});
        const totalProducts = await Product.countDocuments({});
        const totalOrders = await order.countDocuments({});

        const orders = await order.find({});

        const totalRevenueData = orders.reduce((acc, order) => acc + order.totalAmount, 0);
        res.json({
            totalUsers,
            totalProducts,
            totalOrders,
            totalRevenue: totalRevenueData
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching admin stats', error });
    }
};

module.exports = { getAdminStats };