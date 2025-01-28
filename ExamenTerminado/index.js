const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/project', require('./routes/project'));
app.use('/api/task', require('./routes/task'));
app.use('/api/employee', require('./routes/employee'));
app.use('/api/assignment', require('./routes/assignment'));


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});