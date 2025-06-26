const { Op, Sequelize } = require('sequelize');
const Message = require('../models/Message');
const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');


const getFullName = (user) => {
  return user?.studentProfile?.full_name || user?.teacherProfile?.full_name || null;
};

exports.getRecentChats = async (req, res) => {
  try {
    // Try to get userId from params, body, or query
    console.log(`Received request to get recent chats for userId: ${req.user.id}, request: ${req.user}`);
    const userId = req.user.id
    console.log(`Fetching recent chats for userId: ${userId}`);

    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid or missing userId parameter' });
    }
    // Step 1: Find the latest message per room
    const latestMessages = await Message.findAll({
      attributes: [
        [Sequelize.fn('MAX', Sequelize.col('created_at')), 'latest'],
        'room_id'
      ],
      where: {
        [Op.or]: [
          { sender_id: userId },
          { receiver_id: userId }
        ]
      },
      group: ['room_id'],
      raw: true,
    });

    const latestTimestamps = latestMessages.map((m) => m.latest);

    // Step 2: Fetch full message and sender info for these timestamps
    const messages = await Message.findAll({
      where: {
        created_at: {
          [Op.in]: latestTimestamps,
        },
      },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'email'],
          include: [
            {
              model: Student,
              as: 'studentProfile',
              attributes: ['full_name']
            },
            {
              model: Teacher,
              as: 'teacherProfile',
              attributes: ['full_name']
            }
          ]
        },
        {
          model: User,
          as: 'receiver',
          attributes: ['id', 'email'],
          include: [
            {
              model: Student,
              as: 'studentProfile',
              attributes: ['full_name']
            },
            {
              model: Teacher,
              as: 'teacherProfile',
              attributes: ['full_name']
            }
          ]
        }
      ],

      order: [['created_at', 'DESC']],
    });

    const response = messages.map((msg) => ({
      room_id: msg.room_id,
      last_message: msg.message,
      created_at: msg.created_at,
      sender: {
        id: msg.sender.id,
        email: msg.sender.email,
        full_name: getFullName(msg.sender),
      },
      receiver: {
        id: msg.receiver.id,
        email: msg.receiver.email,
        full_name: getFullName(msg.receiver),
      },
    }));

    return res.json(response);
  } catch (err) {
    console.error('Error fetching recent chats:', err);
    return res.status(500).json({ error: 'Failed to fetch recent chats' });
  }
};

exports.getChatHistory = async (req, res) => {
  try {
    const { roomId } = req.params;

    if (!roomId) {
      return res.status(400).json({ error: 'roomId is required' });
    }

    const messages = await Message.findAll({
      where: { room_id: roomId },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'email']
        }
      ],
      order: [['created_at', 'ASC']]
    });

    const formatted = messages.map((msg) => ({
      sender_id: msg.sender_id,
      message: msg.message,
      message_type: msg.message_type,
      created_at: msg.created_at,
      sender_email: msg.sender?.email || null,
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Error fetching chat history:', err);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
};

