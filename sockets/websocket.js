const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const ChatMessage = require('../models/Message');

const wss = new WebSocket.Server({ noServer: true });
const clients = new Map(); // key: userId, value: WebSocket connection

wss.on('connection', (ws, request, userId) => {
  clients.set(userId, ws);

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);
      const { toUserId, text, roomId } = data;

      if (!roomId) {
        console.warn('Missing roomId. Cannot store message.');
        return;
      }

      const msgData = {
        sender_id: userId,
        room_id: roomId,
        message: text,
        message_type: 'text',
        created_at: new Date()
      };

      await ChatMessage.create(msgData);

      const targetWs = clients.get(toUserId);
      if (targetWs) {
        targetWs.send(JSON.stringify({
          from: userId,
          text,
          roomId,
          timestamp: msgData.created_at,
        }));
      } else {
        console.warn(`User ${toUserId} is not connected.`);
      }

    } catch (e) {
      console.error('Invalid message', e);
    }
  });


  ws.on('close', () => {
    clients.delete(userId);
  });
});

module.exports = wss;
