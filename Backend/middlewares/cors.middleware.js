const cors = require("cors")
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(','); // array

const corsOptions = {
    origin:function (origin,cb) {
        if (!origin || allowedOrigins.includes(origin))  // elly b3t el request m4 browser -> postman aw another DB
            return cb(null, true);
        else
            return cb(new Error("CORS Policy Origin Not Allowed"));
    },method:["GET","POST","PUT","DELETE"],
    cradentials: true,
    allowedHeaders:['Content-Type',"Authorization"]
}

module.exports = cors(corsOptions);

