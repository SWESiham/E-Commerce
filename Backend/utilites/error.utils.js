class AppError extends Error{
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        // el status code <400  fail to get , <500 error 
        this.status = `${statusCode}`.startsWith('4') ? "fail" : "error"; 
        // nfr2 el errors gat mnen 
        this.isOperational = true;
        // zy el problems ma btl3 el problems 
        Error.captureStackTrace(this, this.constructor);

    };
}

module.exports = AppError;