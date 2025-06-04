require('dotenv').config();
const path = require('path');
const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const { swaggerUi, specs } = require('./utils/swagger');

const PORT = process.env.PORT || 3000;
const server = http.createServer(app); // Create HTTP server
const io = new Server(server, { cors: { origin: "*" } }); // Attach Socket.io

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

const sequelize = require('./config/sequelize');

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/teacher', teacherRoutes);
app.use('/students', studentRoutes);
app.use('/course', courseRoutes);

// Sync DB if needed
// sequelize.sync({ alter: true }).then(() => {
//   console.log('Tables synced!');
// });

// ✅ FIXED: Start the server using `server.listen`, not `app.listen`
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
