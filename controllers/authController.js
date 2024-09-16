const crypto = require('crypto');
const User = require('../models/userModel');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateResetPasswordEmail } = require('../emailTemplates/resetPasswordEmailTemplate');
const { otpEmailTemplate } = require('../emailTemplates/otpEmailTemplate');
const logger = require('../utils/logger');
const OTP = require('../models/OTP');

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



exports.authToken = async (req, res) => {
  try {

    const { userId, userName, phoneNumber } = req.user;

    logger.info("in authToken info", userId, userName);
    const isvalideUser = await User.findById(userId);
    if (!isvalideUser) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }
    logger.debug("Password reset successful");
    res.status(200).json({ message: 'Auth successful', userId: userId, phoneNumber: phoneNumber, userName: userName });
  } catch (error) {
    logger.verbose("in authToken error", error);
    logger.error("in authToken error", error);
    res.status(500).json({ message: 'Login Error' });
  }
};


// Email Verification
exports.sendOTPToEmail = async (req, res) => {
  try {
    logger.info("enter in sendOTPToEmail", req.body)
    const { email } = req.body;

    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

    const isvalideUser = await User.findOne({ email });
    if (!isvalideUser && isvalideUser != null) {
      logger.info("isvalideUser ", isvalideUser)
      return res.status(400).json({ message: 'Invalid email' });
    }

    // Save OTP in the database
    //console.log("email is ",email, otp, expiresAt);
    await OTP.create({ email, otp, expiresAt });

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const message = otpEmailTemplate(otp);
    await transporter.sendMail({
      to: email,
      subject: 'Email Verification OTP',
      html: message,
    });

    res.status(200).json({ message: 'OTP sent to email' });
  } catch (error) {
    logger.error("Error sending OTP", error);
    res.status(500).json({ message: 'Error sending OTP' });
  }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  try {
    // console.log("req.body",req.body) isVerified
    const { email, otp } = req.body;

    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (otpRecord.expiresAt < Date.now()) {
      return res.status(400).json({ message: 'OTP has expired' });
    }
    // OTP is valid, proceed with updating the user's verification status
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isVerified = true; // Update the isVerified status to true
    await user.save(); // Save the updated user
    // OTP is valid, proceed with further steps
    await OTP.deleteOne({ email, otp }); // Optionally delete or invalidate the OTP

    res.status(200).json({ message: 'OTP verified successfully!' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller to change password
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you're using JWT and user ID is in req.user
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId); // Adjust according to your model
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await user.comparePassword(currentPassword); // Adjust if you're using a different method to compare passwords
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });

    user.password = newPassword; // Update password
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};