const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./db');

console.log('Starting server...');
console.log('Environment check:');
console.log('PORT:', process.env.PORT);
console.log('MONGO_URI exists:', !!process.env.MONGO_URI);
console.log('NODE_ENV:', process.env.NODE_ENV);

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
}).on('error', (err) => {
  console.error('Server failed to start:', err);
  process.exit(1);
});
