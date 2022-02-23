const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

/**
 * chnage password
*/

// create new account
router.post('/register', userController.register);
// login function 
router.post('/login', userController.login);

// for user 
router.get('/', userController.get_all_users);
// change profile
router.patch('/profile/update-profile' , userController.protect , userController.upload_user_photo , userController.update_profile);
module.exports = router;