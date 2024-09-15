const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { forgotPassword, resetPassword,authToken,sendOTPToEmail,changePassword,verifyOTP } = require('../controllers/authController');
const authenticateToken =require('../middleware/authenticateToken ');

router.post('/auth/signup', userController.createUser);
router.post('/auth/login', userController.getUsers);
router.put('/auth/:id', userController.updateUser);
router.delete('/auth/:id', userController.deleteUser);  


router.get('/auth/profile', authenticateToken, userController.getUserProfile);
router.post('/auth/updateProfile', authenticateToken, userController.updateUserProfile);
// Forgot Password Route
router.post('/forgot-password', forgotPassword);

// Reset Password Route
router.post('/reset-password/:token', resetPassword);
router.get('/auth/authToken', authenticateToken,authToken);
router.post('/auth/email-verification', sendOTPToEmail);
router.post('/auth/verifyOtp', verifyOTP);
router.post('/auth/change-password', authenticateToken, changePassword);


module.exports = router;
