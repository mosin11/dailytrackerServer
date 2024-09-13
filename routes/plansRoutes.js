// src/routes/planRoutes.js
const express = require('express');
const router = express.Router();
const Plan = require('../models/Plan');
const authenticateToken = require('../middleware/authenticateToken ');
const logger = require('../utils/logger');

// Route to add a new plan
router.post('/addPlans', authenticateToken, async (req, res) => {
    try {
        logger.info(req.body);
        const { title, description, category } = req.body;
        const newPlan = new Plan({
            title,
            description,
            category,
            userId: req.user.userId,
        });
        await newPlan.save();
        logger.debug("Plan added successfully");
        res.status(201).json(newPlan); // Respond with the newly added plan
    } catch (err) {
        res.status(500).json({ message: 'Error adding plan', error: err });
    }
});

// Route to fetch all plans
router.get('/getAllPlans', authenticateToken, async (req, res) => {
    try {
        logger.info("enter getAllPlans");
        const plans = await Plan.find({ userId: req.user.userId }).sort({ date: -1 });
        logger.info("Fetched all plans successfully");
        res.status(200).json(plans); // Respond with all plans
    } catch (err) {
        res.status(500).json({ message: 'Error fetching plans', error: err });
    }
});

// Route to delete a plan
router.delete('/deletePlan/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const plan = await Plan.findById(id);
        // Check if the plan belongs to the authenticated user
        if (plan.userId.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Unauthorized action' });
        }
        const deletedPlan = await Plan.findByIdAndDelete(id);

        if (!deletedPlan) {
            return res.status(404).json({ message: 'Plan not found' });
        }
        logger.debug("Plan deleted successfully");
        res.status(200).json({ message: 'Plan deleted successfully', plan: deletedPlan });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting plan', error: err });
    }
});

// Route to update a plan
router.put('/updatePlan/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, category, date } = req.body;

        const plan = await Plan.findById(id);

        if (!plan) {
            return res.status(404).json({ message: 'Plan not found' });
        }

        if (plan.userId.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Unauthorized action' });
        }

        const updatedPlan = await Plan.findByIdAndUpdate(id, {
            title,
            description,
            category,
            date,
            userId: req.user.userId,
        }, { new: true });

        if (!updatedPlan) {
            return res.status(404).json({ message: 'Plan not found' });
        }
        logger.debug("Plan updated successfully");
        res.status(200).json(updatedPlan); // Respond with the updated plan
    } catch (err) {
        res.status(500).json({ message: 'Error updating plan', error: err });
    }
});

module.exports = router;
