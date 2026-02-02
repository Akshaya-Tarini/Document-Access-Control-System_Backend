const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/database');
const routes = require('./routes');

const PORT = process.env.PORT || 8080;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ensure uploads dir exists
const uploadsDir = path.resolve(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

app.use('/api', routes);

// health
app.get('/', (req, res) => res.send('Document Access Control Backend'));

(async () => {
  await connectDB();

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})();
