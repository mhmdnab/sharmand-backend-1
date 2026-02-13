const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./db');

// Connect to database
connectDB();

const app = express();
app.use(cors());

// Init Middleware
app.use(express.json({ extended: false }));

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Define Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/upload', require('./routes/upload'));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
