# Roots LMS Backend

A robust Express.js backend API for the Roots Learning Management System, providing comprehensive educational platform services including live video conferencing, real-time messaging, AI voice cloning, and class management.

## 🚀 Features

### Core Services
- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Live Video Conferencing**: LiveKit integration for professional video/audio streaming
- **Real-time Messaging**: WebSocket-based chat system with message persistence
- **Class Management**: Complete CRUD operations for classes, sessions, and enrollments
- **AI Voice Cloning**: Integration with external voice synthesis services
- **File Management**: AWS S3 integration for cloud storage
- **User Management**: Multi-role system (Students, Teachers, Admins)

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js 5.1.0
- **Database**: PostgreSQL with Sequelize ORM 6.37.7
- **Authentication**: JWT (jsonwebtoken)
- **Real-time**: Socket.io + WebSocket
- **Video Conferencing**: LiveKit Server SDK
- **Cloud Storage**: AWS S3 SDK
- **Documentation**: Swagger UI

## 📦 Key Dependencies

```json
{
  "express": "^5.1.0",
  "sequelize": "^6.37.7",
  "pg": "^8.16.0",
  "jsonwebtoken": "^9.0.2",
  "bcryptjs": "^3.0.2",
  "socket.io": "^4.8.1",
  "livekit-server-sdk": "^2.13.0",
  "@aws-sdk/client-s3": "^3.825.0",
  "multer": "^2.0.1",
  "swagger-ui-express": "^5.0.1"
}
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- PostgreSQL 12+
- AWS S3 account
- LiveKit account

### Installation

1. **Clone and install**
   ```bash
   git clone <repository-url>
   cd RootsEdtech
   npm install
   ```

2. **Environment Setup**
   Create `.env` file:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=roots_lms
   JWT_SECRET=your_jwt_secret_key
   PORT=3000
   API_SECRET=your_livekit_api_secret
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_REGION=your_aws_region
   AWS_BUCKET_NAME=your_s3_bucket_name
   ```

3. **Start the server**
   ```bash
   npm start
   ```

## 📁 Project Structure

```
RootsEdtech/
├── index.js                     # Main server entry point
├── config/                      # Configuration files
├── controllers/                 # Route controllers
├── models/                      # Database models
├── routes/                      # API routes
├── services/                    # Business logic
├── middleware/                  # Custom middleware
├── sockets/                     # WebSocket handlers
├── utils/                       # Utility functions
└── uploads/                     # File upload directory
```

## 🔧 API Endpoints

### Authentication
```
POST /auth/login                 # User login
POST /auth/register              # User registration
```

### Class Management
```
GET  /classes                    # Get all classes
POST /classes                    # Create class
GET  /classes/:id                # Get class by ID
POST /classes/:id/start          # Start class session
POST /classes/:id/end            # End class session
```

### Video Conferencing
```
GET  /api/create-room            # Create video room
GET  /api/generate-token         # Generate access token
```

### Messaging
```
GET  /messages                   # Get messages
POST /messages                   # Send message
```

### File Management
```
POST /s3/upload                  # Upload file
GET  /s3/download/:key          # Download file
```

### Voice Cloning
```
POST /ivc                       # Create voice clone
GET  /voices                     # Get voice clones
```

## 🗄️ Database Schema

### Core Tables
- **users**: User authentication and basic info
- **students**: Student-specific profiles
- **teachers**: Teacher-specific profiles
- **classes**: Class definitions and scheduling
- **class_sessions**: Individual class instances
- **class_students**: Many-to-many enrollment
- **messages**: Chat message storage
- **rooms**: Video conference rooms
- **voices**: Cloned voice data

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **Role-based Access**: Students, Teachers, Admins
- **Input Validation**: Request data validation
- **CORS Configuration**: Cross-origin request handling

## 🔄 Real-time Features

- **WebSocket Server**: Custom WebSocket implementation
- **Socket.io Integration**: Additional real-time features
- **LiveKit Integration**: Professional video conferencing
- **Message Broadcasting**: Real-time message delivery

## 📊 API Documentation

Access Swagger documentation at: `http://localhost:3000/api-docs`

## 🧪 Testing

```bash
npm test
```

## 📱 Deployment

### Production Environment
```env
NODE_ENV=production
PORT=3000
DB_HOST=your_production_db_host
JWT_SECRET=your_production_jwt_secret
```

### Docker Deployment
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection**
   ```bash
   sudo service postgresql status
   psql -h localhost -U username -d roots_lms
   ```

2. **Port Conflicts**
   ```bash
   lsof -i :3000
   kill -9 <PID>
   ```

3. **Dependencies Issues**
   ```bash
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

## 📈 Performance Optimization

- **Connection Pooling**: Efficient database connections
- **Query Optimization**: Optimized Sequelize queries
- **Response Compression**: Gzip compression
- **Rate Limiting**: API rate limiting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check API documentation at `/api-docs`
- Review the troubleshooting section

---

**Built with ❤️ using Node.js and Express**