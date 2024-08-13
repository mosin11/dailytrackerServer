const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { forgotPassword, resetPassword,authToken } = require('../controllers/authController');
const authenticateToken =require('../middleware/authenticateToken ');

router.post('/auth/signup', userController.createUser);
router.post('/auth/login', userController.getUsers);
router.put('/auth/:id', userController.updateUser);
router.delete('/auth/:id', userController.deleteUser);  

// Forgot Password Route
router.post('/forgot-password', forgotPassword);

// Reset Password Route
router.post('/reset-password/:token', resetPassword);
router.get('/auth/authToken', authenticateToken,authToken);




module.exports = router;
