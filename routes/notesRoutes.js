const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const authenticateToken =require('../middleware/authenticateToken ')
const logger = require('../utils/logger')

// Route to add a new note
router.post('/addNotes', authenticateToken,async (req, res) => { 
    try {
        const { title, description, category } = req.body;
        const newNote = new Note({
            title,
            description,
            category,
            userId: req.user.userId,
        });
        await newNote.save();
         logger.debug("noted added fuccessfully")
        res.status(201).json(newNote); // Respond with the newly added note
    } catch (err) {
        res.status(500).json({ message: 'Error adding note', error: err });
    }
});

// Route to fetch all notes
router.get('/getAllNotes', authenticateToken,async (req, res) => {
    try {
        const notes = await Note.find({ userId: req.user.userId });
        logger.debug("noted All notes fuccessfully")
        res.status(200).json(notes); // Respond with all notes
    } catch (err) {
        res.status(500).json({ message: 'Error fetching notes', error: err });
    }
});
// Route to delete a note
router.delete('/deleteNote/:id', authenticateToken,async (req, res) => {
    try {
        const { id } = req.params;
        const note = await Note.findById(id);
         // Check if the note belongs to the authenticated user
         if (note.userId.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Unauthorized action' });
        }
        const deletedNote = await Note.findByIdAndDelete(id);

        if (!deletedNote) {
            return res.status(404).json({ message: 'Note not found' });
        }
        logger.debug("Note deleted successfully")
        res.status(200).json({ message: 'Note deleted successfully', note: deletedNote });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting note', error: err });
    }
});

// Route to update a note
router.put('/updateNote/:id', authenticateToken,async (req, res) => {
    try {
        
        const { id } = req.params;
     
        const { title, description, category,date } = req.body;

        const note = await Note.findById(id);

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        if (note.userId.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Unauthorized action' });
        }
      
        const updatedNote = await Note.findByIdAndUpdate(id, { 
             title,
             description, 
             date,category ,
             userId: req.user.userId,
        }, { new: true });
        if (!updatedNote) {
            return res.status(404).json({ message: 'Note not found' });
        }
        logger.debug("Note updated successfully")
        res.status(200).json(updatedNote); // Respond with the updated note
    } catch (err) {
        res.status(500).json({ message: 'Error updating note', error: err });
    }
});
module.exports = router;
