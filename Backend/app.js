const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const connectDB = require('./config/db.config');
const corsOptions = require("./middlewares/cors.middleware");
const  AppError = require('./utilites/error.utils');
const globalErrorHandler = require('./middlewares/erorr-handler.middleware');
const app = express();
const path = require('path');
const port = process.env.PORT;

app.use(corsOptions);
app.use(express.json());
connectDB();
app.use('/uploads', express.static(path.join(__dirname, './uploads')));

app.use('/api/user', require('./routes/user.route'));
app.use('/api/product', require('./routes/product.route'));
app.use('/api/category', require('./routes/category.route'));
app.use('/api/sub-category', require('./routes/sub-category.route'));
app.use('/api/auth', require('./routes/auth.route'));
app.use('/api/cart', require('./routes/cart.route'));
app.use('/api/order', require('./routes/order.route'));
app.use('/api/analytics',  require('./routes/analytics.route'));
app.use('/api/testimonial',  require('./routes/testimonial.route'));
app.use('/api/faq',  require('./routes/faq.route'));
app.use((req, res, next) => {  
    next(new AppError(`can't find ${req.originalUrl} on this server`,404));
});
app.use(globalErrorHandler);

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});