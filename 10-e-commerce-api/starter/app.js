require('dotenv').config();
require('express-async-errors');

// express
const express = require('express');
const app = express();

// connectDB
const connectDB = require('./db/connect');

// Cloudinary upload

const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Routers
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRoutes');
const reviewRouter = require('./routes/reviewRoute');

// Rest of the pakages

const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(morgan('tiny'));
app.use(cors());

app.use(fileUpload({ useTempFiles: true }));
app.use(express.static('./public'));
app.get('/', (req, res) => {
  console.log(req.signedCookies);
  res.send('<h1>Ecommerce-Api</h1><h2>PhucHero</h2>');
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/reviews', reviewRouter);

/**
 * Middlewares
 */

const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// Not found
app.use(notFoundMiddleware);
// Error handler
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`E-Commerce API || Server is listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
