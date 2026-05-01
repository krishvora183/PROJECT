const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Get dashboard summary statistics
// @route   GET /api/reports/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const orders = await Order.find({});
    
    // Quick Metrics
    const totalOrders = orders.length;
    // Calculate total revenue
    const totalRevenue = orders.reduce((acc, item) => acc + item.totalPrice, 0);
    
    // Active Users (count all users who are not admins)
    const activeUsers = await User.countDocuments({ role: 'customer' });
    
    // Fake pending complaints for now since there's no active complaint tracking schema yet
    const pendingComplaints = 0; 
    
    // Recent Orders (last 5)
    const recentOrdersDb = await Order.find({}).sort({ createdAt: -1 }).limit(5).populate('user', 'name');
    
    const recentOrders = recentOrdersDb.map(order => ({
      id: order._id.toString().substring(0,8),
      customer: order.user ? order.user.name : 'Guest User',
      amount: `₹${order.totalPrice}`,
      status: order.isDelivered ? 'Delivered' : (order.isPaid ? 'Processing' : 'Pending')
    }));

    res.json({
      stats: [
        { label: 'Total Orders', value: totalOrders.toString(), change: '+0%', icon: '📦', color: '#4f46e5' },
        { label: 'Total Revenue', value: `₹${totalRevenue.toFixed(2)}`, change: '+0%', icon: '💰', color: '#10b981' },
        { label: 'Active Users', value: activeUsers.toString(), change: '+0%', icon: '👥', color: '#f59e0b' },
        { label: 'Pending Complaints', value: pendingComplaints.toString(), change: '0%', icon: '📝', color: '#ef4444' }
      ],
      recentOrders
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error fetching dashboard stats' });
  }
};

// @desc    Get detailed analytics and metrics
// @route   GET /api/reports/analytics
// @access  Private/Admin
const getDetailedAnalytics = async (req, res) => {
  try {
    // 1. Sales Report (Aggregate by month - Simplified for demonstration)
    // We will group the revenue by month
    const currentDate = new Date();
    const salesDataRaw = await Order.aggregate([
      {
        $group: {
          _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
          revenue: { $sum: "$totalPrice" },
          orders: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // Fill out the last 6 months even if missing data
    const salesData = [];
    for (let i = 5; i >= 0; i--) {
        const d = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        const mth = d.getMonth() + 1; // 1-12
        const yr = d.getFullYear();
        
        const found = salesDataRaw.find(x => x._id.month === mth && x._id.year === yr);
        salesData.push({
            month: monthNames[mth - 1],
            revenue: found ? found.revenue : 0,
            orders: found ? found.orders : 0
        });
    }

    // 2. Top Products (Aggregate sold quantities)
    // Map over all orders, count frequency of products
    const orders = await Order.find({}).populate('orderItems.product');
    const productSalesMap = {};
    
    orders.forEach(order => {
        order.orderItems.forEach(item => {
            const prodName = item.name;
            if(!productSalesMap[prodName]) productSalesMap[prodName] = { sales: 0, revenue: 0 };
            productSalesMap[prodName].sales += item.qty;
            productSalesMap[prodName].revenue += (item.qty * item.price);
        });
    });

    const topProducts = Object.keys(productSalesMap).map((key, index) => ({
      id: index + 1,
      name: key,
      sales: productSalesMap[key].sales,
      revenue: `₹${productSalesMap[key].revenue}`
    })).sort((a,b) => b.sales - a.sales).slice(0, 5); // top 5
    
    // 3. Inventory Status (All products sorted by stock level)
    const allProducts = await Product.find({}).sort({ countInStock: 1 });
    const inventoryReport = allProducts.map(p => {
        let status = 'In Stock';
        if (p.countInStock === 0) status = 'Out of Stock';
        else if (p.countInStock < 10) status = 'Low Stock';
        
        return {
            id: p._id.toString().substring(0,8),
            name: p.name,
            stock: p.countInStock,
            status
        };
    });

    // 4. Top Customers
    const customerAgg = await Order.aggregate([
      { $group: { _id: "$user", totalSpent: { $sum: "$totalPrice" }, orders: { $sum: 1 } } },
      { $sort: { totalSpent: -1 } },
      { $limit: 5 }
    ]);
    
    // Populate user details for the top customers
    const customerReport = [];
    for(let c of customerAgg) {
       if (c._id) {
           const usr = await User.findById(c._id);
           if (usr) {
               customerReport.push({
                   id: usr._id.toString().substring(0,8),
                   name: usr.name,
                   orders: c.orders,
                   spent: `₹${c.totalSpent}`
               });
           }
       }
    }

    res.json({
        salesData,
        topProducts,
        inventoryReport,
        customerReport,
        totalRevenue: `₹${salesDataRaw.reduce((acc, curr) => acc + curr.revenue, 0).toFixed(2)}`,
        totalOrders: salesDataRaw.reduce((acc, curr) => acc + curr.orders, 0)
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error fetching detailed analytics' });
  }
};

module.exports = { getDashboardStats, getDetailedAnalytics };
