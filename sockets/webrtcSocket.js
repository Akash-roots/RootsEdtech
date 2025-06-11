// sockets/webrtcSocket.js
module.exports = (io) => {
  const rooms = {}; // Map of roomId -> array of socket ids

  io.on('connection', (socket) => {
    console.log('✅ WebRTC user connected:', socket.id);

    socket.on('join-room', ({ roomId }) => {
      socket.join(roomId);

      // Add to room map
      if (!rooms[roomId]) {
        rooms[roomId] = [];
      }
      rooms[roomId].push(socket.id);

      console.log(`Socket ${socket.id} joined room ${roomId}`);

      // Send existing peers to newly joined socket
      const otherPeers = rooms[roomId].filter((id) => id !== socket.id);
      socket.emit('joined-peers', otherPeers);

      // Notify other peers that new peer joined
      socket.to(roomId).emit('user-joined', socket.id);

      // Handle offer
      socket.on('offer', (data) => {
        io.to(data.to).emit('offer', {
          from: socket.id,
          offer: data.offer,
        });
      });

      // Handle answer
      socket.on('answer', (data) => {
        io.to(data.to).emit('answer', {
          from: socket.id,
          answer: data.answer,
        });
      });

      // Handle ICE candidate
      socket.on('ice-candidate', (data) => {
        io.to(data.to).emit('ice-candidate', {
          from: socket.id,
          candidate: data.candidate,
        });
      });

      socket.on('disconnect', () => {
        console.log('❌ WebRTC user disconnected:', socket.id);

        // Remove from room
        if (rooms[roomId]) {
          rooms[roomId] = rooms[roomId].filter((id) => id !== socket.id);
          if (rooms[roomId].length === 0) {
            delete rooms[roomId];
          }
        }

        // Notify other peers that this peer left
        socket.to(roomId).emit('peer-left', socket.id);
      });
    });
  });
};
