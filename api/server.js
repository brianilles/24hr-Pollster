const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

// route imports
const authRouter = require('./users/auth/authRouter.js');
const usersRouter = require('./users/usersRouter.js');
const pollsRouter = require('./polls/pollsRouter.js');
const feedsRouter = require('./feeds/feedRouter.js');

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

// user routes, restricted
server.use('/api/users', restricted, usersRouter);

// polls routes, restricted
server.use('/api/polls', restricted, pollsRouter);

// feed routes, restricted
server.use('/api/feeds/', restricted, feedsRouter);

module.exports = server;
