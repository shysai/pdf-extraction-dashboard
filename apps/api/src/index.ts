import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import multer from 'multer';
import path from 'fs';
import { extractData } from './controllers/extractController';
import { getInvoices, getInvoice, createInvoice, updateInvoice, deleteInvoice } from './controllers/invoiceController';
import { uploadPDF } from './controllers/uploadController';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Basic middleware
app.use(express.json({ limit: '25mb' }));

// Create uploads directory if it doesn't exist
import fs from 'fs';
const uploadsDir = './uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Multer configuration - SIMPLE AND WORKING
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 25 * 1024 * 1024,
  }
});

// Make sure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

// Health check endpoint
app.get('/health', (req: any, res: any) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Routes
app.post('/upload', upload.single('file'), uploadPDF);
app.post('/extract', extractData);
app.get('/invoices', getInvoices);
app.get('/invoices/:id', getInvoice);
app.post('/invoices', createInvoice);
app.put('/invoices/:id', updateInvoice);
app.delete('/invoices/:id', deleteInvoice);

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pdf-extraction';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    
    // Start server only after MongoDB connection
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
      console.log(`🗄️  MongoDB: ${MONGODB_URI}`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('💡 Make sure MongoDB is running on your system');
  });

// MongoDB connection events
mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB connected successfully');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected');
});