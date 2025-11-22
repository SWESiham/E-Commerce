const purchase = require('../models/purchase.model');
const productSchema = require('../models/product.model');
const { purge } = require('../routes/product.route');
const { default: mongoose } = require('mongoose');

// exports.createPurchase = async (req, res) => {
//     const {product,quantity,price } = req.body;
//     // _id da elly fel database
//     const USerId = req.user._id;
//     const myProduct = await productSchema.findById(product);
//     if(myProduct){
//         const newPurchase = await purchase.create({ product, quantity, price: myProduct.price,user: USerId });
        
//   return  res.status(200).json({ message: "Purchase created", data: newPurchase });

//     }
//     else {
//   return  res.status(404).json({ message: "Product not found"});
        
// }
// }

// session 3l4an 2der a3mel transaction y3ny lw el product etb3 el stock y 2l

exports.createPurchase = async (req, res) => {
  const { product, quantity, price } = req.body;
  const USerId = req.user._id;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const updatedProduct = await productSchema.findOneAndUpdate(
      {
        _id: product,
        stock:{
          $gte: quantity
        }
      },
      {
        $inc:
        {
          stock: -quantity
        }
      },
      {
        new: true, session
      }
    );

    if (!updatedProduct) {
      throw new Error("Product not Found or out of stock");
    }
    const newPurchase = await purchase.create(
     { user:USerId,quantity:quantity,product,price:updatedProduct.price}
      , { session });
    

    if (!newPurchase) {
        throw new Error("purchase is created an error ")
      }
    await session.commitTransaction();
    session.endSession();
    return res.status(200).json({ message: "Purchase created successfully!", data: newPurchase });
  } catch (err) {
    // lw el product tmm w newPurchase m4 kways el purchase mtall4 el quantity 3l4an kda lazm y g3 el stocks w quantity zy ma homa
    await session.abortTransaction();
    session.endSession();
   return res.status(200).json({ err: `transaction failed ${err.message}`});
  }
}


exports.getUserPurchase=async(req,res)=>{
    const userId = req.user._id;
    console.log(userId);
    
    const perchase = await purchase.find({ user:userId }).populate("product",'name imgURL').populate("user","name");
    console.log(perchase);
    
    return res.status(200).json({ message: "Retrive User Purchases",data: perchase});
}



exports.getALLUserPurchase=async(req,res)=>{
     const perchaseOfAll = await purchase.find().populate("product",'name imgURL').populate("user","name");
   return res.status(200).json({ message: "Retrive All User Purchases",data:perchaseOfAll });
}


