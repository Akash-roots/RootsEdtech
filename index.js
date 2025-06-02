require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const { swaggerUi, specs } = require('./utils/swagger'); // adjust path


app.use(express.json());


// Mount Swagger UI
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

// sequelize.sync({ alter: true }).then(() => {
//   console.log('Tables synced!');
// });


app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
