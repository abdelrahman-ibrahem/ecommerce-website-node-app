const express = require('express');
const router = express.Router();
const { protect } = require('../controllers/user');
const cartController = require('../controllers/cart');

/*
    tomorrow
        hanel view pages and handel logout function 
        handel payment function 
        Edit html pages

    -where user is looged in
        // for notmal users
        payment with paypal => last step
*/


// for normal users
// my cart
router.get('/my-cart' , protect , cartController.my_cart);
// add to car function 
router.post('/add-to-cart/:productId' , protect , cartController.add_to_cart);
// delete from cart function => if the user is admin or not
router.delete('/delete-from-cart/:id' , protect , cartController.delete_from_cart);
// for update quantity
//router.patch('/update-cart/:id' , protect , cartController.update_cart);

// for admin 
// get all orders 
router.get('/orders' , protect , cartController.get_all_orders);


module.exports = router;