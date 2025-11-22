const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

exports.authenticate = async(req,res,next)=>{
    const authHeader = req.headers.authorization;
if(!authHeader?.startsWith('Bearer ')){
   return res.status(401).json({message:'no token provided'})
}
const token = authHeader.split(' ')[1];
try{
const decode = jwt.verify(token,process.env.JWT_SECRET);
const user = await User.findById(decode.id).select('-password');

if(!user){
    return res.staus(404).json({message:'user not found'})
}
req.user = user
next();
}
catch(err){
return res.status(403).json({message:'Taken is not valid or expired'})
}
}