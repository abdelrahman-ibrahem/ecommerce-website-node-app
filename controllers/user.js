const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');

// handel upload image file for user 
const storage = multer.diskStorage({
    destination: (req , file , cb)=>{
        cb(null , 'public/img/users');
    },
    filename: (req , file , cb)=>{
        const ext = file.mimetype.split('/')[1];
        const f = file.originalname.split('.')[0];
        cb(null , `users-${f}-${Date.now()}.${ext}`); // null if no errors and name of the file upload
    }
});

const upload = multer({storage: storage});

exports.upload_user_photo = upload.single('photo');

exports.register = async (req , res)=>{
    try{
        const user = await User.findOne({email: req.body.email});
        if (user){
            return res.status(400).json({
                status: "failed",
                message: "this email is already registed"
            });
        }
        const newUser = await User.create({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
            isAdmin: req.body.isAdmin,
            address: req.body.address,
        });
        res.status(200).json({
            status: "sucess",
            message: "Your account is created",
            email: newUser.email,
            first_name: newUser.first_name,
            last_name: newUser.last_name,
            username: newUser.username,
            isAdmin: newUser.isAdmin,
            address: newUser.address,
        });
    }catch(err){
        res.status(404).json({
            status: "failed",
            mesasge: err.mesasge
        });
    }
};

exports.login = async (req , res)=>{
    try{
        const user = await User.findOne({email: req.body.email});
        if (!user){
            return res.status(400).json({
                status: "failed",
                message: "this account not found"
            });
        }
        const correct = await bcrypt.compare(req.body.password, user.password);
        if (!correct){
            return res.status(400).json({
                status: "failed",
                message: "invalid email or password, Please try again",
            });
        }
        const token = jwt.sign({id:user._id}, process.env.JWT , {
            expiresIn: '12h'
        });
        res.cookie('jwt' , token  , {httpOnly: true});
        res.status(200).json({
            status: "sucess",
            message: "Your logged in",
            token,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
        });
    }catch(err){
        res.status(404).json({
            status: "failed",
            mesasge: err.mesasge
        });
    }
};

exports.protect = async  (req , res , next)=>{
    try{
        let token;
        if (req.headers.authorization){
            token = req.headers.authorization;
        }else if (req.cookies.jwt){
            token = req.cookies.jwt;
        }
        if (!token){
            return res.status(401).json({
                status: "failed",
                message: "access denied"
            });
        }
        const decoded = jwt.verify(token , process.env.JWT);
        const current = await User.findById(decoded.id);
        req.user = current;
        next();
    }catch(err){
        res.status(404).json({
            status: "failed",
            message: err.message
        });
    }
};

exports.protect_view = async (req , res , next)=>{
    try{
        let token;
        if (req.headers.authorization){
            token = req.headers.authorization;
        }else if (req.cookies.jwt){
            token = req.cookies.jwt;
        }
        if (!token){
            return next()
        }
        const decoded = jwt.verify(token , process.env.JWT);
        const current = await User.findById(decoded.id);
        req.user = current;
        next();
    }catch(err){
        return next();
    }
};

exports.get_all_users = async (req , res)=>{
    try{
        const users = await User.find();
        res.status(200).json({
            status: "sucess",
            message: "these all users",
            length: users.length,
            data: {
                users
            }
        });
    }catch(err){
        res.status(404).json({
            status: "failed",
            mesasge: err.mesasge
        });
    }
};


exports.update_profile = async (req , res)=>{
    try{
        //console.log(req.file);
        const updated = await User.findByIdAndUpdate(req.user._id ,{
        photo: req.file.filename
    } , {new: true});
        
       res.status(200).json({
           status: "sucess",
           message: "the user is updated",
           user: updated
       });
    }catch(err){
        res.status(404).json({
            status: "failed",
            mesasge: err.message
        });
    }
};