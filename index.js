require('dotenv').config();
const path = require('path');
const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const { swaggerUi, specs } = require('./utils/swagger');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const sequelize = require('./config/sequelize');
const wss = require('./sockets/websocket'); // Make sure the path is correct
const Class = require('./models/Class');
const Student = require('./models/Student');
const ClassStudent = require('./models/ClassStudent');





const PORT = process.env.PORT || 3000;
const server = http.createServer(app); // Create HTTP server
const io = new Server(server, { cors: { origin: "*" } }); // Attach Socket.io
app.use(cors()); // 🔓 Allow all origins (for local dev)

// Serve static files (like webrtc.html)
app.use(express.static(path.join(__dirname, 'public')));

// Load signaling logic
require('./sockets/webrtcSocket')(io); // Load WebRTC socket handlers

app.use(express.json());

// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const teacherRoutes = require('./routes/teacher.routes');
const studentRoutes = require('./routes/student.routes');
const courseRoutes = require('./routes/course.routes');
const s3Routes = require('./routes/s3.routes');
const livekitRoutes = require('./routes/livekit.routes');
const messagesRoutes = require('./routes/message.routes');
const roomRoutes = require('./routes/room.routes')
const classRoutes = require('./routes/class.routes');





app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/teachers', teacherRoutes);
app.use('/students', studentRoutes);
app.use('/course', courseRoutes);
app.use('/s3', s3Routes);
app.use('/api', livekitRoutes);
app.use('/messages', messagesRoutes);
app.use('/room',roomRoutes);
app.use('/classes', classRoutes);



// // Sync DB if needed
sequelize.sync({ alter: true }).then(() => {
  console.log('Tables synced!');
});


// Associations
Class.belongsToMany(Student, {
  through: ClassStudent,
  foreignKey: 'class_id',
  otherKey: 'student_id',
});
Student.belongsToMany(Class, {
  through: ClassStudent,
  foreignKey: 'student_id',
  otherKey: 'class_id',
});



// ✅ Handle WebSocket upgrade with token authentication
server.on('upgrade', (request, socket, head) => {
  const token = new URL(request.url, `http://${request.headers.host}`).searchParams.get('token');

  if (!token) return socket.destroy();

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request, payload.id); // use payload.id as userId
    });
  } catch (err) {
    console.error("WebSocket upgrade failed:", err.message);
    socket.destroy();
  }
});



server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});