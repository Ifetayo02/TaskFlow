// server/index.js
const express = require('express');
const http = require('http');        // ← new
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const initSocket = require('./config/socket');  // ← new
const errorHandler = require('./middleware/errorHandler');
const startDeadlineChecker = require('./utils/deadlineChecker');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);  // ← wrap app in http server
const io = initSocket(server);          // ← attach socket to server

// make io accessible in controllers if needed later
app.set('io', io);

// middleware
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

// routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/workspaces', require('./routes/workspaces'));
app.use('/api/boards', require('./routes/boards'));
app.use('/api/tasks', require('./routes/tasks'));


// error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {           // ← server.listen not app.listen
  console.log(`Server running on port ${PORT}`);
});

startDeadlineChecker();