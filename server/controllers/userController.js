const User = require('../models/User');
const redis = require('redis');
const redisClient = redis.createClient();

redisClient.on('error', (err) => console.log('Redis Client Error', err));

redisClient
  .connect()
  .then(() => {
    console.log('Redis connected');
  })
  .catch((err) => {
    console.error('Redis connection error', err);
  });

const getUser = async (req, res) => {
  const { id } = req.params;

  if (!redisClient.isOpen) {
    return res.status(500).json({ message: 'Redis client is not connected' });
  }

  try {
    const cachedUser = await redisClient.get(`user:${id}`);

    if (cachedUser) {
      console.log('User from cache');
      return res.status(200).json(JSON.parse(cachedUser));
    } else {
      const foundUser = await User.findById(id);
      console.log('User from database');
      if (!foundUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Cache the user for one hour
      await redisClient.set(`user:${id}`, JSON.stringify(foundUser), {
        EX: 3600,
      });
      return res.status(200).json(foundUser);
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  const user = new User({ name, email, password });
  await user.save();
  res.status(201).json(user);
};

module.exports = { getUser, createUser };
