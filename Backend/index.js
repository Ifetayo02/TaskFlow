const dotenv = require('dotenv');
const path = require('path');

// load .env.local first (real secrets), then .env (dummy fallback)
dotenv.config({ path: path.resolve(process.cwd(), '.env.local'), override: true });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const express = require('express');
const http = require('http');
const cors = require('cors');

const connectDB = require('./config/db');
const initSocket = require('./config/socket');
const errorHandler = require('./middleware/errorHandler');
const startDeadlineChecker = require('./utils/deadlineChecker');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = initSocket(server);
app.set('io', io);

// replace your current cors line with this
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

// session needed for passport Google flow


// routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/workspaces', require('./routes/workspaces'));
app.use('/api/boards', require('./routes/boards'));
app.use('/api/tasks', require('./routes/tasks'));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

startDeadlineChecker();