const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Save farmer info as a new JSON file for each registration
app.post('/api/farmer', (req, res) => {
  const data = req.body;
  const timestamp = Date.now();
  const filePath = path.join(__dirname, 'farmerInfo_' + timestamp + '.json');
  fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to save farmer info.' });
    }
    res.status(200).json({ message: 'Farmer info saved!', file: filePath });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Backend API running on port', PORT));
