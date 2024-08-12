const express = require('express');
const router = express.Router();
const Note = require('../models/Note');

// Route to add a new note
router.post('/addNotes', async (req, res) => { 
    try {
        const { title, description, category } = req.body;
        const newNote = new Note({
            title,
            description,
            category
        });
        await newNote.save();
        res.status(201).json(newNote); // Respond with the newly added note
    } catch (err) {
        res.status(500).json({ message: 'Error adding note', error: err });
    }
});

// Route to fetch all notes
router.get('/getAllNotes', async (req, res) => {
    try {
        const notes = await Note.find();
        res.status(200).json(notes); // Respond with all notes
    } catch (err) {
        res.status(500).json({ message: 'Error fetching notes', error: err });
    }
});
// Route to delete a note
router.delete('/deleteNote/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedNote = await Note.findByIdAndDelete(id);
        if (!deletedNote) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.status(200).json({ message: 'Note deleted successfully', note: deletedNote });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting note', error: err });
    }
});

// Route to update a note
router.put('/updateNote/:id', async (req, res) => {
    try {
        
        const { id } = req.params;
     
        const { title, description, category,date } = req.body;
      
        const updatedNote = await Note.findByIdAndUpdate(id, { title, description, date,category }, { new: true });
        if (!updatedNote) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.status(200).json(updatedNote); // Respond with the updated note
    } catch (err) {
        res.status(500).json({ message: 'Error updating note', error: err });
    }
});
module.exports = router;
