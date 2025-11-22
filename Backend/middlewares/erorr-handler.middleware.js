module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    // el stack mynf4 yzher fel production bs fel delveloping 
    if (process.env.NODE_ENV === "development") {
        res.status(err.statusCode).json({ status: err.status, error: err, message: err.message, stack: err.stack })
    } else {
        if (err.isOperational) // da el error bt3y
            res.status(err.statusCode).json({ status: err.status, message: err.message })
        else
            res.status(500).json({ status: 'Error', message: "something went wrong" })
    }
}

