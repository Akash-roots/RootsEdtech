// controllers/roomController.js
const Room = require('../models/Room');

exports.getOrCreateRoom = async (req, res) => {
  try {
    console.log('Incoming request body:', req.body);
    const user1Id = req.user.id; // Authenticated user (e.g. student)
    const { user2Id } = req.body; // The other user (e.g. teacher)
    console.log('user1Id:', user1Id, 'user2Id:', user2Id);

    if (!user2Id) {
      console.log('user2Id missing in request');
      return res.status(400).json({ message: 'user2Id is required' });
    }

    // Ensure user1 < user2 for consistent pairing
    const [minId, maxId] = user1Id < user2Id ? [user1Id, user2Id] : [user2Id, user1Id];
    console.log('minId:', minId, 'maxId:', maxId);

    let room = await Room.findOne({
      where: { user1_id: minId, user2_id: maxId }
    });
    console.log('Room found:', room);

    if (!room) {
      console.log('No room found, creating new room');
      room = await Room.create({
        user1_id: minId,
        user2_id: maxId
      });
      console.log('New room created:', room);
    }

    console.log('Returning roomId:', room.id);
    return res.status(200).json({ roomId: room.id });
  } catch (err) {
    console.error('Error getting/creating room:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
