const Contact = require('../models/contactModel');



exports.get_all_messages =  async (req , res)=>{
    try {
        const messages = await Contact.find();
        res.status(200).json({
            status: "success",
            length: messages.length,
            messages: (messages.length > 0)? messages : "No messages" 
        });
    }catch(err){
        res.status(404).json({
            status: "failed",
            message: err.message
        });
    }
};


exports.delete_message = async (req ,res)=>{
    try {
        await Contact.findByIdAndRemove(req.params.messageId);
        res.status(200).json({
            status: "success",
            message: "message deleted"
        });
    }catch(err){
        res.status(404).json({
            status: "failed",
            message: err.message
        });
    }
};


exports.create_new_message = async (req , res)=>{
    try {
        const newMessage = await Contact.create({
            name: req.body.name,
            email: req.body.email,
            message: req.body.message,
            phone: req.body.phone
        });
        res.status(200).json({
            status: "success",
            message: "create new message",
            message: newMessage
        });
    }catch(err){
        res.status(404).json({
            status: "failed",
            message: err.message
        });
    }
};