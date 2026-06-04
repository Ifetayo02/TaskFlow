const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
const cors = require('cors');
const session = require('express-session');
const passport = require('./config/passport');
const connectDB = require('./config/db');
const initSocket = require('./config/socket');
const errorHandler = require('./middleware/errorHandler');
// const startDeadlineChecker = require('./utils/deadlineChecker');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = initSocket(server);
app.set('io', io);

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
app.use(express.json());

// session needed for passport Google flow
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

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

// startDeadlineChecker();