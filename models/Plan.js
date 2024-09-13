// src/models/Plan.js
const mongoose = require('mongoose');

const PlanSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    date: { type: Date, default: Date.now },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }
});

module.exports = mongoose.model('Plan', PlanSchema);
