const express = require('express');
const app = express();
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const path = require('path');
const userRouter = require('./routes/user');
const productRouter = require('./routes/product');
const cartRouter = require('./routes/cart');
const contactRouter = require('./routes/contact');
const orderRouter = require('./routes/order');
const viewRouter = require('./routes/view');
const flash = require('express-flash');
const connect = require('connect');
const cookieSession = require('cookie-session');
const dotenv = require('dotenv');
const xss = require('xss-clean');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');

dotenv.config({path: './config.env'});

// handel view engine and views and public folders
app.set('view engine' , 'pug');
app.set('views' , path.join(__dirname , 'views'));
app.use(express.static(path.join(__dirname , 'public')));

// handel middelware
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
if (process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}
app.use(xss());
app.use(mongoSanitize());
app.use(compression());
//app.use(express.session({ cookie: { maxAge: 60000 }}));
app.use(cookieSession({
    keys: ['secret1', 'secret2']
}));
app.use(flash());

const url ='mongodb+srv://abdelrahman:test1234@ecommerce-website.1pbno.mongodb.net/ecommerce-website?retryWrites=true&w=majority';
// connect DB connection
mongoose.connect(url , { useNewUrlParser: true , useUnifiedTopology: true}).then(()=>{
    if (process.env.NODE_ENV === 'development')
        console.log('DATABASE is connect');
}).catch(err=>{
    if (process.env.NODE_ENV === 'development')
        console.log(`ERROR: ${err.message}`);
});


// ROUTES
// FOR VIEWS
app.use('/' , viewRouter);
// for apis
app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/carts', cartRouter);
app.use('/api/v1/contact', contactRouter);
app.use('/api/v1/orders', orderRouter);

// for page not found
app.use((req , res , next)=>{
    res.render('error');
    next();
});

// run Application
const port = 3000;
app.listen(port , ()=>{
    if (process.env.NODE_ENV === 'development')
        console.log('App is Running');
});