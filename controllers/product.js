const Product = require('../models/productModel');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req , file , cb)=>{
        cb(null , 'public/img/products');
    },
    filename: (req, file , cb)=>{
        const ext = file.mimetype.split('/')[1];
        const f = file.originalname.split('.')[0];
        cb(null , `products-${f}-${Date.now()}.${ext}`); // null if now Error during upload image file , and name of the file
    }
});

const upload = multer({storage});
exports.upload_product_image = upload.single('image');

exports.get_all_products = async (req , res) =>{
    try{
        const products = await Product.find();
        res.status(200).json({
            status: "success",
            message: "get all products",
            length: products.length,
            products
        });
    }catch(err){
        res.status(404).json({
            status: "failed",
            message: err.message
        });
    }
};

exports.get_product_with_slug = async (req , res)=>{
    try{
        const product = await Product.findOne({slug: req.params.slug});
        res.status(200).json({
            status: "success",
            message: "get product",
            product
        });
    }catch(err){
        res.status(404).json({
            status: "failed",
            message: err.message
        });
    }
};

exports.get_all_products_with_category_electronic = async (req , res)=>{
    try{
        const products = await Product.find({category: "Electronic"});
        res.status(200).json({
            status: "success",
            message: "get all electronic products",
            length: products.length,
            products
        });
    }catch(err){
        res.status(404).json({
            status: "failed",
            message: err.message
        });
    }
};

exports.get_all_products_with_category_books = async (req , res)=>{
    try{
        const products = await Product.find({category: "books"});
        res.status(200).json({
            status: "success",
            message: "get all books products",
            length: products.length,
            products
        });
    }catch(err){
        res.status(404).json({
            status: "failed",
            message: err.message
        });
    }
};

exports.get_all_products_with_category_clothes =  async (req , res)=>{
    try{
        const products = await Product.find({category: "clothes"});
        res.status(200).json({
            status: "success",
            message: "get all clothes products",
            length: products.length,
            products
        });
    }catch(err){
        res.status(404).json({
            status: "failed",
            message: err.message
        });
    }
};

exports.create_new_product = async (req , res)=>{
    try{
        const newProduct = await Product.create({
            user: req.user._id,
            name: req.body.name,
            category: req.body.category,
            description: req.body.description,
            price: req.body.price,
            discount: req.body.discount,
            image: req.file.filename
        });
        res.status(200).json({
            status: "success",
            message: `the ${newProduct.name} is add`,
            product: newProduct
        });
    }catch(err){
        res.status(404).json({
            status: "failed",
            message: err.message
        });
    }
};

exports.delete_product = async (req , res)=>{
    try{
        await Product.findByIdAndRemove(req.params.productId);
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
};

exports.update_product = async (req , res)=>{
    try{
        const updated = await Product.findByIdAndUpdate(req.params.productId , req.body ,{new: true});
        res.status(200).json({
            status: "success",
            message: "the product is updated",
            product: updated
        });
    }catch(err){
        res.status(404).json({
            status: "failed",
            message: err.message
        });
    }
};