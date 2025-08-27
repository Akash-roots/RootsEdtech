const Note = require('../models/Note');

// Save note
exports.logNote = async (req, res) => {
  try {
    console.log("req.body",req.body);
    
    const { room, identity, message } = req.body;

    if (!room || !identity || !message) {
      return res.status(400).json({ error: 'Missing room, identity, or message' });
    }

    // Option A: overwrite existing note for room (latest state only)
    let note = await Note.findOne({ where: { room_id: room, identity } });

    if (note) {
      note.message = message;
      await note.save();
    } else {
      note = await Note.create({
        room_id: room,
        identity,
        message,
      });
    }

    res.json(note);
  } catch (err) {
    console.error('Note log error:', err);
    res.status(500).json({ error: 'Failed to save note' });
  }
};

// Fetch room notes
exports.getNotes = async (req, res) => {
  try {
    const room = req.params.room;
    const notes = await Note.findAll({ where: { room_id: room } });
    res.json(notes);
  } catch (err) {
    console.error('Note fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
};
