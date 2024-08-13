const crypto = require('crypto');
const User = require('../models/userModel'); 
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateResetPasswordEmail } = require('../emailTemplates/resetPasswordEmailTemplate');
const logger = require('../utils/logger');

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
   
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    
    // Set token expiration time (e.g., 10 mints)
    const resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpire = resetPasswordExpire;
    await user.save();

    // Send email with the token
    const clientUrl = process.env.CLIENT_URL;
    const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

    // Email message
    const message = generateResetPasswordEmail(user, resetUrl);
    
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    
    await transporter.sendMail({
      to: user.email,
      subject: 'Password Reset Request',
      html: message,
    });
    logger.debug("Password reset link sent to email")
    res.status(200).json({ message: 'Password reset link sent to email' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending email' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const { password } = req.body;

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    logger.debug("Password reset successful")
    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: 'Error resetting password' });
  }
};
