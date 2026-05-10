const express = require('express');
const cors = require('cors');
require('dotenv').config();

const verifyToken = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Traveloop API is running!');
});

// Example of a Protected Route
app.get('/api/user/data', verifyToken, (req, res) => {
  // req.user contains the decoded Firebase token (e.g. req.user.uid, req.user.email)
  res.json({
    message: "This is secure data from the backend!",
    user: {
      uid: req.user.uid,
      email: req.user.email
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
