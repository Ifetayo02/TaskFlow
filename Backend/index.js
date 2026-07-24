const path = require('path');
const http = require('http');
const https = require('https');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(process.cwd(), '.env.local'), override: true });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
const connectDB = require('./config/db');
const initSocket = require('./config/socket');
const errorHandler = require('./middleware/errorHandler');
const startDeadlineChecker = require('./utils/deadlineChecker');

const app = express();
const server = http.createServer(app);
const io = initSocket(server);

app.set('io', io); 
connectDB();
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'https://task-flow-omega-seven.vercel.app',
  ],
  credentials: true,
}));
app.use(express.json());

const keepAlive = () => {
  const url = process.env.SERVER_URL;
  if (url && url.includes('onrender.com')) {
    setInterval(() => {
      https.get(url, (res) => {
        console.log(`Keep-alive ping: ${res.statusCode}`);
      }).on('error', (err) => {
        console.error('Keep-alive ping failed:', err.message);
      });
    }, 14 * 60 * 1000); 
  }
};
keepAlive();

app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/workspaces', require('./routes/workspaces'));
app.use('/api/boards', require('./routes/boards'));
app.use('/api/tasks', require('./routes/tasks'));
app.use(errorHandler);
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  startDeadlineChecker();
});