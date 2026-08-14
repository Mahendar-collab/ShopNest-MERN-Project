const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');

dotenv.config();

connectDB();

const app = express();

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true
}));

app.use(express.json());

// API routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

// Serve React frontend in production
if (process.env.NODE_ENV === 'production') {

  const frontendPath = path.join(__dirname, '../frontend/build');

  // Serve React static files
  app.use(express.static(frontendPath));

  // React Router fallback
  app.use((req, res) => {

    if (req.path.startsWith('/api/')) {
      return res.status(404).json({
        message: 'API route not found'
      });
    }

    res.sendFile(path.join(frontendPath, 'index.html'));
  });

} else {

  app.get('/', (req, res) => {
    res.send('ShopNest API is running in Development mode...');
  });

}

const PORT = process.env.PORT || 10000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});