require('dotenv').config();
require('express-async-errors');

// express
const express = require('express');
const app = express();

// connectDB
const connectDB = require('./db/connect');

// Routers
const authRouter = require('./routes/authRoutes');

// Rest of the pakages

const morgan = require('morgan');
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(morgan('tiny'));
app.get('/', (req, res) => {
  console.log(req.cookies);
  res.send('<h1>Ecommerce-Api</h1><h2>PhucHero</h2>');
});

app.use('/api/v1/auth', authRouter);

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
