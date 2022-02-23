const express = require('express');
const router = express.Router();
const {protect} = require('../controllers/user');
const productController = require('../controllers/product');
// for normal user
// get all the products
router.get('/', productController.get_all_products);
// get product with slug
router.get('/product-detail/:slug' , productController.get_product_with_slug);
// get products of category Electronics
router.get('/electronic-products', productController.get_all_products_with_category_electronic);
router.get('/books-products', productController.get_all_products_with_category_books);
router.get('/clothes-products',productController.get_all_products_with_category_clothes);

// for admin 
// create new product
router.post('/' , protect ,productController.upload_product_image , productController.create_new_product);
// delete product with Id
router.delete('/delete-product/:productId' , protect , productController.delete_product);
// update product
router.patch('/update-product/:productId' , protect ,productController.upload_product_image ,productController.update_product);


module.exports = router;