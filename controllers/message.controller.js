const Message = require('../models/Message');
const User = require('../models/User')
const { Op } = require('sequelize');

exports.getRecentChats = async (req, res) => {
  try {
    const teacherId = req.user.id;

    const recentChats = await Message.findAll({
      where: {
        sender_id: teacherId,
      },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'email'], // or 'full_name' if it exists
        }
      ],
      group: ['Message.room_id', 'Message.sender_id', 'Message.created_at', 'sender.id', 'sender.email'],
      order: [['created_at', 'DESC']],
    });

    res.json(recentMessages);
  } catch (error) {
    console.error('Error fetching recent chats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
