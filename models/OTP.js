const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  otp: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
}, {
  timestamps: true, // Automatically add createdAt and updatedAt fields
});

const OTP = mongoose.model('OTP', otpSchema);

module.exports = OTP;
