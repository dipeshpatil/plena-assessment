if (![process.env.NODE_ENV, process.env.APP_ENV].includes('production'))
  require('dotenv').config({ path: './config/.env' });

const express = require('express');
const cors = require('cors');
const { appConfig } = require('./config/config');

const connectDatabase = require('./config/database');

// Routes
const userRoute = require('./routes/api/user');
const authRoute = require('./routes/api/auth');
const postRoute = require('./routes/api/post');

const app = express();

// Connect to the database
connectDatabase();

app.use(cors());

// Init Middleware
app.use(express.json({ extended: false }));

// Server Check
app.get('/', (req, res) => res.send('API Running'));

// Define Routes
app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/post', postRoute);

// Configure Port
const PORT = appConfig.port;

// Start Server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
