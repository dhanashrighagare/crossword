const express = require('express');
const multer = require('multer');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

dotenv.config();

const PORT = process.env.PORT || 8000;

// Connect to MongoDB
connectDB();

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
}));
app.use(express.json()); // Parse JSON bodies

app.use('/api/test', require('./routes/testRoutes'));
app.use('/api/books', require('./routes/bookRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Image Storage Engine
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'upload/images'),
    filename: (req, file, cb) => {
      cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
  });
  
  const upload = multer({ storage: storage });

  // Creating Upload Endpoint for images (Middleware )
  app.use('/images', express.static(path.join(__dirname, 'upload/images')));

  app.post("/upload", upload.single('book'), (req, res) => {

    console.log({req});
      
    if (req.file) {
      const imageUrl = `http://localhost:${PORT}/images/${req.file.filename}`;
      res.json({ success: true, image_url: imageUrl });
  } else {
      res.status(400).json({ success: false, message: 'No file uploaded' });
  }
});
  

app.listen(PORT, () => {
    console.log(`Node Server Running In ${process.env.DEV_MODE || 'development'} Mode On Port ${PORT}`);
});
