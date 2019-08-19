const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

// import routes
const authRouter = require('./users/auth/authRouter.js');
const usersRouter = require('./users/usersRouter.js');

// restricted middleware
const restricted = require('./users/auth/restrictedMiddleware.js');

// create server instance
const server = express();

// apply helmet, cors, json
server.use(helmet());
server.use(express.json());
server.use(cors());

// test route
server.get('/', (req, res) => {
  res.status(200).json({ message: 'success' });
});

// auth routes
server.use('/api/auth', authRouter);

// user routes
server.use('/api/users', restricted, usersRouter);

module.exports = server;
