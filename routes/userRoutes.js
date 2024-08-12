const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { forgotPassword, resetPassword } = require('../controllers/authController');

router.post('/auth/signup', userController.createUser);
router.post('/auth/login', userController.getUsers);
router.put('/auth/:id', userController.updateUser);
router.delete('/auth/:id', userController.deleteUser);  

// Forgot Password Route
router.post('/forgot-password', forgotPassword);

// Reset Password Route
router.post('/reset-password/:token', resetPassword);




module.exports = router;
