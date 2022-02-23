const express = require('express');
const router = express.Router();
const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const { protect } = require('../controllers/user');


/*
    // for normal user
        create new order
    // for admin 
        get all orders
        delete order

    // Error
    try{

    }catch(err){
        res.status(404).json({
            status: "failed",
            message: err.message
        });
    }

*/

// normal user
// create order
router.post('/:cartId/:productId' , protect , async (req , res)=>{
    try{
        const order = await Order.create({
            cart: req.params.cartId,
            user: req.user._id,
            product: req.params.productId,
            quantity: req.body.quantity,
            name: req.body.name,
            email: req.body.email,
            address: req.body.address,
            phone: req.body.phone,
            size: req.body.size,
        });
        res.status(200).json({
            status: "success",
            order
        });
    }catch(err){
        res.status(404).json({
            status: "failed",
            message: err.message
        });
    }
});

// for admin 
// get all orders

router.get('/' , protect , async (req , res)=>{
    try{
        const orders = await Order.find().populate('user', 'username email').populate('cart' , '_id').populate('product', 'name image price');
        res.status(200).json({
            status: "success",
            length: orders.length,
            orders: (orders.length > 0)? orders: 'No orders' 
        });
    }catch(err){
        res.status(404).json({
            status: "failed",
            message: err.message
        });
    }
});


router.delete('/delete-order/:orderId' , protect , async (req , res)=>{
    try{
        const order = await Order.findById(req.params.orderId).populate('cart');
        //await Cart.findByIdAndRemove(order.cart._id)
        await Order.findByIdAndRemove(req.params.orderId);
        res.status(200).json({
            status: "success",
            message: "deleted"
        });
    }catch(err){
        res.status(404).json({
            status: "failed",
            message: err.message
        });
    }
});
module.exports = router;