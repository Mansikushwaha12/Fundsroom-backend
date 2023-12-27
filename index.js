const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

mongoose.connect('mongodb+srv://praveen2408:praveen@cluster0.emyokxy.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

const todoSchema = new mongoose.Schema({
  title: String,
  description: String,
  completed: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const Todo = mongoose.model('Todo', todoSchema);

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
});

userSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) return next();
  try {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    next();
  } catch (err) {
    return next(err);
  }
});

const User = mongoose.model('User', userSchema);

// Express middleware to parse JSON requests
app.use(express.json());

// Register a user
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = new User({ username, password });
    await user.save();
    res.status(201).send('User registered successfully');
  } catch (error) {
    res.status(500).send('Failed to register user');
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).send('Invalid username or password');
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).send('Invalid username or password');
    }
    res.status(200).send('Login successful');
  } catch (error) {
    res.status(500).send('Login failed');
  }
});

app.get('/todos/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    const todos = await Todo.find({ user: userId });
    res.json(todos);
  } catch (error) {
    res.status(500).send('Failed to fetch ToDos');
  }
});

app.post('/todos/:userId', async (req, res) => {
  const userId = req.params.userId;
  const { title, description } = req.body;

  try {
    const newTodo = new Todo({ title, description, user: userId });
    await newTodo.save();
    res.status(201).send('ToDo added successfully');
  } catch (error) {
    res.status(500).send('Failed to add ToDo');
  }
});

app.use((req, res) => {
  res.status(404).send('Route not found');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
