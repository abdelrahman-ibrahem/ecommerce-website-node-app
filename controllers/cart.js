const Cart = require('../models/cartModel');


exports.my_cart = async (req , res)=>{
    try{
        const myOrders = await Cart.find({user: req.user._id}).populate('product').populate('user');
        res.status(200).json({
            status: "success",
            message: "all product in your cart",
            length: myOrders.length,
            myOrders: (myOrders.length > 0? myOrders : "No products in your cart")
        });
    }catch(err){
        res.status(400).json({
            status: "failed",
            message: err.message
        });
    }
};

exports.add_to_cart =  async (req , res)=>{
    try{
        const newOrder = await Cart.create({
            user: req.user._id,
            product: req.params.productId,
            //quantity: req.body.quantity
        });
        res.status(200).json({
            status: "success",
            message: "new order is created",
            order: newOrder
        });
    }catch(err){
        res.status(400).json({
            status: "failed",
            message: err.message
        });
    }
};

exports.delete_from_cart = async (req , res)=>{
    try{
        await Cart.findByIdAndRemove(req.params.id);
        res.status(200).json({
            status:"success",
            message: "deleted"
        });
    }catch(err){
        res.status(400).json({
            status: "failed",
            message: err.message
        });
    }
};
/*
exports.update_cart = async (req , res)=>{
    try{
        const updatedCart = await Cart.findByIdAndUpdate(req.params.id , {
            quantity: req.body.quantity
        }, { new: true});
        res.status(200).json({
            status:"the order is updated",
            cart: updatedCart
        });
    }catch(err){
        res.status(404).json({
            status: "failed",
            message: err.message
        });
    }
};
*/

exports.get_all_orders = async (req , res)=>{
    try{
        const myOrders = await Cart.find().populate('product').populate('user');
        res.status(200).json({
            status: "success",
            message: "all product in your cart",
            length: myOrders.length,
            myOrders: (myOrders.length > 0? myOrders : "No orders")
        });
    }catch(err){
        res.status(400).json({
            status: "failed",
            message: err.message
        });
    }
};