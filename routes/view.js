const express = require('express');
const router = express.Router();
const Product = require('../models/productModel');
const Contact = require('../models/contactModel');
const Cart = require('../models/cartModel');
const Order = require('../models/orderModel');
const User = require('../models/userModel');
const { protect_view  , upload_user_photo, protect } = require('../controllers/user');
const jwt = require('jsonwebtoken');
const {  upload_product_image } = require('../controllers/product');
const bcrypt = require('bcrypt');


/*
    // handel view routes
        - handel home page => finish
        - handel product page  => finish
        - handel login and logout and signup , profile pages 
        - handel contact form
        - handel message page
        - handel add to cart function and remove from cart
        - handel cart page
        - handel check out page
        - handel order page

    // create order | payment with paypal
    // back to line 155, remmber this line need to edit before run Application
*/


// home page 
router.get('/' , protect_view , async (req , res)=>{
    
    const products = await Product.find();
    //console.log(req.user);
    res.render('index' , {
        user: req.user,
        products
    });
    
});
// product page 
router.get('/product-detail/:slug' , protect_view , async (req , res)=>{
    const product = await Product.findOne({slug: req.params.slug});
    res.status(200).render('product' , {
        user: req.user,
        product
    });
});

// categoey page 
router.get('/category' , protect_view , async (req , res)=>{
    const clothesProduct = await Product.find({category: 'clothes'});
    const electronicProduct = await Product.find({category: 'Electronic'});
    const bookProduct = await Product.find({category: 'books'});
    //console.log(clothesProduct, electronicProduct , bookProduct);
    res.status(200).render('category' , {
        user: req.user,
        clothesP: clothesProduct,
        electronicP: electronicProduct,
        bookP: bookProduct,
    });
});

// message page 
router.get('/message' , protect_view,  async (req , res)=>{
    const messages = await Contact.find(); 
    res.status(200).render('message' , {
        user: req.user,
        messages
    });
});
// create new message

router.post('/create-message' , async (req , res)=>{
    await Contact.create({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        message: req.body.message,
    }).then(result=>{
        //console.log(result);
        req.flash('info' , 'your message is received');
        res.redirect('/');
    }).catch(err=>{
        //console.log(err.message);
        
        req.flash('info' , `${err.message}`);
        res.redirect('/');
    });
});

// delete message 
router.get('/delete-message/:messageId' , async (req , res)=>{
    try{
        await Contact.findByIdAndRemove(req.params.messageId);
        req.flash('info' , 'massaged is deleted');
        res.redirect('/message');
    }catch(err){
        //console.log(err.message);
        req.flash('info' , `${err.message}`);
        res.redirect('/message');
    }
});

// cart page 
router.get('/cart' ,  protect_view, async (req , res)=>{
    const products = await Cart.find({user: req.user._id}).populate('product');
    let total = 0;
    for (let i =0 ; i< products.length ;i++){
        if (products[i].product.discount){
            total+= products[i].product.discount;
        }else{
            total+= products[i].product.price;
        }
    }
    //console.log(total);
    res.status(200).render('cart' , {
        user: req.user,
        products,
        total
    });
});

// add to cart 
router.get('/add-to-cart/:productId' , protect_view , async (req , res)=>{
    try{
        await Cart.create({
            user: req.user._id,
            product: req.params.productId
        }).then(result=>{
            //console.log(result);
            return res.status(200).redirect('/cart');
        }).catch(err=>{
            //console.log(err);
            req.flash('info' , `${err.message}`);
            return res.redirect('/');
        });
    }catch(err){
        req.flash('info' , 'Please login first or create your account and login');
        res.redirect('/');
    }
});

// delete from cart 
router.get('/delete-from-cart/:cartId' , protect_view , async (req , res)=>{
    await Cart.findByIdAndRemove(req.params.cartId).then(()=>{
        return res.redirect('/cart');
    }).catch(err=>{
        //console.log(err.message);
        return res.redirect('/cart');
    });
});


// checkout page 
router.get('/checkout/:cartId/:productId' , protect_view,  async (req , res)=>{
    const product = await Product.findById(req.params.productId);
    res.status(200).render('checkout',  {
        user: req.user,
        product,
        cartId: req.params.cartId
    });
});

// create new order
// this function is need to edit after add to template => remmeber this Abdelrahman
router.post('/create-new-order/:cartId/:productId' ,protect_view ,  async (req , res)=>{
    //console.log(req.body);
    //console.log(req.body.size)
    //console.log(req.cookies);
    await Order.create({
        cart: req.params.cartId,
        user: req.user._id,
        product: req.params.productId,
        quantity: req.body.quantity,
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        size: req.body.size,
    }).then(result=>{
        //console.log(result);
        req.flash('info' , 'Request will be followed up');
        return res.redirect(`/checkout/${req.params.cartId}/${req.params.productId}`);
    }).catch(err=>{
        //console.log(err.message);
        let message = err.message.split(':')[2];
        req.flash('info' , `${message}`);
        return res.redirect(`/checkout/${req.params.cartId}/${req.params.productId}`);
    });
});

// orders page 
router.get('/orders' , protect_view ,async (req , res)=>{
    const orders = await Order.find().populate('product').populate('cart');
    //console.log(orders);
    res.status(200).render('orders' , {
        user: req.user,
        orders
    });
});

// delete order 
router.get('/delete-order/:orderId', protect_view , async (req , res)=>{
    await Order.findByIdAndRemove(req.params.orderId).then(()=>{
        //req.flash('info' , 'Order is deleted');
        return res.redirect('/orders');
    }).catch(err=>{
        //console.log(err.message);
        //req.flash('info' , `${err.message}`);
        return res.redirect('/orders');
    });
});


// login page 
router.get('/login' , protect_view ,async (req , res)=>{
    res.status(200).render('login' , {
        user: req.user,
    });
});
// login function 
router.post('/login' , async (req , res)=>{

    try{
        const user =  await User.findOne({email: req.body.email});
        if (!user){
            req.flash('info' , 'The email is not found');
            return res.redirect('/login');
        }
        const correct = await bcrypt.compare(req.body.password , user.password);
        if (!correct){
            req.flash('info' , 'Invalid password');
            return res.redirect('/login');
        }
        const token = jwt.sign({id: user._id} , process.env.JWT , {
            expiresIn: '12h'
        });
        res.cookie('jwt' , token , {httpOnly: true});
        res.status(200).redirect('/');
    }catch(err){
        //console.log(err.message);
        req.flash('info' , `${err.message}`);
        res.status(404).redirect('/login');
    }
    // await User.findOne({email: req.body.email}).then(async user=>{
    //     if (!user){
    //         res.redirect('/signup');
    //     }
    //     const correct = await bcrypt.compare(req.body.password , user.password);
    //     if (!correct){
    //         res.redirect('/login');
    //     }
    //     const token = jwt.sign({id: user._id} , process.env.JWT , {
    //         expiresIn: '12h'
    //     });
    //     res.cookie('jwt' , token , {httpOnly: true});
    //     res.status(200).redirect('/');
    // }).catch(err=>{
    //     console.log(err.message);
    //     res.redirect('/signup');
    // });
});

// handel logout function 
router.get('/logout' , (req , res)=>{
    res.cookie('jwt' , 'loggingout' , { httpOnly: true });
    res.status(200).redirect('/');
});


// signup page 
router.get('/signup' , protect_view , async (req , res)=>{
    res.status(200).render('signup', {
        user: req.user,
    });
});

router.post('/signup' , async (req , res)=>{
    const user = await User.findOne({email: req.body.email});
    if (user){
        req.flash('info' , 'The email is already exists');
        return res.status(200).redirect('/login');
    }
   await User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        isAdmin: req.body.isAdmin,
        address: req.body.address,
        first_name:req.body.first_name,
        last_name:req.body.last_name
    }).then(newUser=>{
        //console.log(newUser);
        return res.status(200).redirect('/login');
    }).catch(err=>{
        //console.log(err.message);
        req.flash('info' ,`${err.message}`);
        return res.status(400).redirect('/signup');
    });
});

// profile page 
router.get('/profile' , protect_view , async (req , res)=>{
    res.status(200).render('profile' , {
        user: req.user,
    });
});

// for update profile
router.post('/profile/update/:userId', protect_view ,  async (req , res)=>{
    await User.findByIdAndUpdate(req.params.userId ,req.body , {new: true}).then(result=>{
        //console.log(result);
        req.flash('info' , 'your profile is updated');
        res.status(200).redirect('/profile');
    }).catch(err=>{
        //console.log(err.message);
        req.flash('info' , `${err.message}`);
        res.status(400).redirect('/profile');
    });
});

// for update password
router.post('/profile/update-pasword/:userId' , protect_view , async (req , res)=>{
    try{
        await User.findById(req.params.userId).then(async result=>{
            const correct = await  bcrypt.compare(req.body.currentPassword , result.password);
            if (!correct){
                req.flash('info' , 'Please enter invalid password');
                return res.status(400).redirect('/profile');
            }
            result.password = req.body.password;
            result.passwordConfirm = req.body.passwordConfirm;
            await result.save().then(data=>{
                //console.log(data);
                req.flash('info' , 'Your password is updated');
                res.status(200).redirect('/profile');
            }).catch(err=>{
                //console.log(err.message);
                req.flash('info' , `${err.message}`);
                res.status(400).redirect('/profile');
            });
        }).catch(err=>{
            //console.log(err.message);
            req.flash('info' , `${err.message}`);
            res.status(400).redirect('/profile');
        });
    }catch(err){
        //console.log(err.message);
        let message = err.message.split(':')[2];
        req.flash('info' , `${message}`);
        ress.redirect('/profile');
    }
});

// upload image for user
// not finished
router.post('/profile/update-image/:userId' , protect_view , protect , upload_user_photo , async (req , res)=>{
    try{
        await User.findByIdAndUpdate(req.params.userId , {
            photo: req.file.filename
        } ,{new: true}).then(data=>{
            //console.log(data);
            req.flash('info' , 'Your image is updated');
            res.status(200).redirect('/profile');
        }).catch(err=>{
            //console.log(err.message);
            req.flash('info' , `${err.message}`);
            res.status(404).redirect('/profile');
        });
    }catch(err){
        //console.log(err.message);
        let message = err.message.split(':')[2];
        req.flash('info' , `${message}`);
        res.redirect('/profile');
    }
});
function searchFunc(req , res , next){
    req.query.limit = '1';
    req.query.fields = 'name';
    next();
}
// for search by using name of the product
router.get('/search'  , async (req , res)=>{
    try{
        //const  { search } = req.query;
        const products = await Product.find({name:{'$regex':req.query.search}});
        //console.log(req.query);
        res.status(200).render('search-page' , {
            user: req.user,
            products
        });
    }catch(err){
        res.render('error');
    }
});

// for admin user
// get all products and can you delete product if the product not found
router.get('/products-admin' , protect_view , async (req , res)=>{
    const products = await Product.find();
    res.status(200).render('products-admin' , {
        user: req.user,
        products
    })
});

// delete product if the user is admin 
router.get('/delete-product-from-products/:productId' , protect_view , async (req , res)=>{
    try{
        await Product.findByIdAndRemove(req.params.productId).then(()=>{
            res.redirect('/products-admin');
        }).catch(err=>{
            res.redirect('/products-admin');
        });
    }catch(err){
        res.status(404).redirect('/products-admin');
    }
});

// add product page 
router.get('/add-product' , protect_view,  async (req , res)=>{
    res.status(200).render('add-product' , {
        user: req.user,
    })
});

// create new product
router.post('/create-new-product' , protect_view , upload_product_image , async (req , res)=>{
    try{
        //console.log(req.file);
        await Product.create({
            user: req.user._id,
            name: req.body.name,
            category: req.body.category,
            description: req.body.description,
            price: req.body.price,
            discount: req.body.discount,
            image: req.file.filename,
        }).then(result=>{
            //console.log(result);
            req.flash('info' , `${result.name} is created`);
            return res.redirect('/products-admin');
        }).catch(err=>{
            let message = err.message.split(':')[2];
            req.flash('info' , `${message}`);
            return res.redirect('/add-product');
        });
    }catch(err){
        //console.log(err.message);
        let message = err.message.split(':')[2];
        req.flash('info' , `${message}`);
        res.redirect('/add-product');
    }
});
// for reset password
router.get('/forget-password' , async (req , res)=>{
    res.status(200).render('forget-password');
});

router.post('/forget-password' ,async (req , res)=>{
    const {email} = req.body;
    await User.findOne({email}).then(async user=>{
        if (!user){
            req.flash('info' , 'This email is not registered');
            return res.redirect('/forget-password');
        }
        const token = jwt.sign({id: user._id , email: email} , 'jwtPrivateKey' , {expiresIn: '12h'});
        res.redirect(`/reset-password/${user._id}/${token}`);
        
    }).catch(err=>{
        const message = err.message.split(':')[2];
        req.flash('info' , `${message}`);
        res.redirect('/forget-password');
    })
});

router.get('/reset-password/:id/:token' , async (req, res)=>{
    res.status(200).render('reset-password');
});
router.post('/reset-password/:id/:token' , async (req, res)=>{
    const { id , token  } = req.params;
    await User.findById(id).then(async user=>{
        if (!user){
            req.flash('info' , 'This email is not registered');
            return res.redirect(`/reset-password/${user._id}/${token}`);
        }
        const check = jwt.verify(token , 'jwtPrivateKey');
        if (!check){
            req.flash('info' , 'access denied');
            return res.redirect(`/reset-password/${user._id}/${token}`);
        }
        user.password = req.body.password;
        user.passwordConfirm = req.body.passwordConfirm;
        await user.save().then(result=>{
            req.flash('info' , `Your password is updated`);
            return res.redirect(`/login`);
        }).catch(err=>{
            const message = err.message.split(':')[2];
            req.flash('info' , `${message}`);
            res.redirect(`/reset-password/${user._id}/${token}`);
        });
    }).catch(err=>{
        const message = err.message.split(':')[2];
        req.flash('info' , `${message}`);
        res.redirect(`/reset-password/${user._id}/${token}`);
    });
});

module.exports = router;