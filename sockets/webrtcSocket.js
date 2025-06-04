// sockets/webrtcSocket.js
module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('✅ WebRTC user connected:', socket.id);

    socket.on('join', (roomId) => {
      socket.join(roomId);
      socket.to(roomId).emit('user-joined', socket.id);
    });

    socket.on('offer', (data) => {
      socket.to(data.room).emit('offer', data.offer);
    });

    socket.on('answer', (data) => {
      socket.to(data.room).emit('answer', data.answer);
    });

    socket.on('ice-candidate', (data) => {
      socket.to(data.room).emit('ice-candidate', data.candidate);
    });

    socket.on('disconnect', () => {
      console.log('❌ WebRTC user disconnected:', socket.id);
    });
  });
};
