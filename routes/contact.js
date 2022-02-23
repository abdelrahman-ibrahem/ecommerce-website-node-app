const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact');

// for admin 
// get all message
router.get('/',contactController.get_all_messages);
// delete message 
router.delete('/delete/:messageId' , contactController.delete_message);
// create new message for normal user
router.post('/' , contactController.create_new_message);

module.exports = router;