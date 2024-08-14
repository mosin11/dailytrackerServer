const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, },
    phoneNumber: { type: String, required: true },
    date: { type: Date, default: Date.now },
    isVerified: { type: Boolean, default: false }, 
    createDate :{type: Date, default: Date.now},
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date, default: Date.now },
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
    //console.log("this.password",this.password, "candidatePassword",candidatePassword)
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('com_users', UserSchema);

module.exports = User;
