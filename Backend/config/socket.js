
const socketIO = require('socket.io');

const initSocket = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    
    socket.on('join_board', (boardId) => {
      socket.join(boardId);
      console.log(`Socket ${socket.id} joined board: ${boardId}`);
    });

    
    socket.on('leave_board', (boardId) => {
      socket.leave(boardId);
      console.log(`Socket ${socket.id} left board: ${boardId}`);
    });

    
    socket.on('task_moved', ({ boardId, taskId, status, position }) => {
      
      socket.to(boardId).emit('task_moved', { taskId, status, position });
    });

    
    socket.on('task_created', ({ boardId, task }) => {
      socket.to(boardId).emit('task_created', { task });
    });

    
    socket.on('task_updated', ({ boardId, task }) => {
      socket.to(boardId).emit('task_updated', { task });
    });

    
    socket.on('task_deleted', ({ boardId, taskId }) => {
      socket.to(boardId).emit('task_deleted', { taskId });
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

module.exports = initSocket;