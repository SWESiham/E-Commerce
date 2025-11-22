const Order = require("../models/order.model");
const mongoose = require("mongoose");

exports.getSalesSummary = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const matchStage = {};

        // Set date range
        if (startDate && endDate) {
            matchStage.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        } else {
            // Default to last 30 days
            const end = new Date();
            const start = new Date();
            start.setDate(end.getDate() - 30);
            matchStage.createdAt = {
                $gte: start,
                $lte: end
            };
        }

        const summary = await Order.aggregate([
            { $match: matchStage },
            { $unwind: '$products' },
            {
                $lookup: {
                    from: 'products',
                    localField: 'products.productId',
                    foreignField: '_id',
                    as: 'productDetails'
                }
            },
            { $unwind: '$productDetails' },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            { $unwind: '$userDetails' },
            {
                $addFields: {
                    itemTotal: { 
                        $multiply: ['$productDetails.price', '$products.quantity'] 
                    }
                }
            },
            {
                $facet: {
                    overallStats: [
                        {
                            $group: {
                                _id: null,
                                totalSalesAmount: { $sum: '$totalPrice' },
                                totalQuantitySold: { $sum: '$products.quantity' },
                                totalPurchases: { $sum: 1 },
                                averageOrderValue: { $avg: '$totalPrice' }
                            }
                        }
                    ],
                    topProducts: [
                        {
                            $group: {
                                _id: '$products.productId',
                                title: { $first: "$productDetails.title" },
                                revenue: { $sum: '$itemTotal' },
                                quantity: { $sum: "$products.quantity" },
                                image: { $first: "$productDetails.image" }
                            }
                        },
                        { $sort: { revenue: -1 } },
                        { $limit: 5 }
                    ],
                    topUsers: [
                        {
                            $group: {
                                _id: '$userId',
                                name: { $first: "$userDetails.name" },
                                email: { $first: "$userDetails.email" },
                                totalSpent: { $sum: "$totalPrice" },
                                totalPurchases: { $sum: 1 },
                                totalQuantity: { $sum: "$products.quantity" },
                            }
                        },
                        { $sort: { totalSpent: -1 } },
                        { $limit: 5 }
                    ],
                    monthlySales: [
                        {
                            $group: {
                                _id: {
                                    year: { $year: '$createdAt' },
                                    month: { $month: '$createdAt' },
                                },
                                totalRevenue: { $sum: '$totalPrice' },
                                quantity: { $sum: { $sum: '$products.quantity' } },
                                orderCount: { $sum: 1 }
                            }
                        },
                        { $sort: { '_id.year': 1, '_id.month': 1 } }
                    ],
                    dailySales: [
                        {
                            $group: {
                                _id: {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: "$createdAt"
                                    }
                                },
                                revenue: { $sum: '$totalPrice' },
                                orders: { $sum: 1 }
                            }
                        },
                        { $sort: { '_id': 1 } },
                        { $limit: 30 }
                    ],
                    categorySales: [
                        {
                            $group: {
                                _id: '$productDetails.category',
                                revenue: { $sum: '$itemTotal' },
                                quantity: { $sum: '$products.quantity' }
                            }
                        },
                        { $sort: { revenue: -1 } }
                    ]
                }
            }
        ]);

        return res.status(200).json({
            message: "Sales report generated successfully",
            data: summary[0],
            dateRange: {
                start: matchStage.createdAt.$gte,
                end: matchStage.createdAt.$lte
            }
        });

    } catch (error) {
        console.error("Error generating sales report:", error);
        return res.status(500).json({
            message: "Error generating report",
            error: error.message
        });
    }
};