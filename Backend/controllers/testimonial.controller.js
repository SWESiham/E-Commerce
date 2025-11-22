const Testimonial = require("../models/testimonial.model");
const catchAsync = require('../utilites/catch-async.utils');
const AppError = require('../utilites/error.utils');

exports.createTestimonial = catchAsync(
    async (req, res, next) => {
        const { message } = req.body;
        const userId = req.user._id;
        const testimonial = await Testimonial.create({ message, userId, status: 'pending' });
        res.status(201).json({
            message: "Testimonial submitted and awaiting admin approval",
            data: testimonial
        });

    });
exports.getTestimonials = catchAsync(
    async (req, res, next) => {
        const testimonials = await Testimonial.find({ status: 'approved' }).populate("userId", "name email");;
        if (!testimonials.length)
            return next(new AppError("No testimonials found", 404));
        res.status(200).json({
            message: "All Testimonials",
            data: testimonials
        });
    })


exports.approveTestimonial = catchAsync(
    async (req, res, next) => {
        const { id } = req.params;
        const testimonial = await Testimonial.findByIdAndUpdate(id, {
            status: 'approved', rejectionReason: null
        }, { new: true });

        if (!testimonial)
            return next(new AppError("Testimonial not found", 404));
        res.status(200).json({
            message: "Testimonial approved successfully",
            data: testimonial
        });
    });

exports.rejectTestimonial = catchAsync(
    async (req, res, next) => {
        const { reason } = req.body;

        const { id } = req.params;
        const testimonial = await Testimonial.findByIdAndUpdate(id, { status: 'rejected', rejectionReason: reason || 'No Reason Provided' },{new:true});
        if (!testimonial)
            return next(new AppError("Testimonial not found", 404));
        res.status(200).json({
            message: "Testimonial rejected",
            data: testimonial
        });

    })
    exports.getAllTestimonials = catchAsync(async (req, res, next) => {
  const testimonials = await Testimonial.find().populate("userId", "name email");
  res.status(200).json({
    message: "All testimonials (admin view)",
    data: testimonials
  });
});
