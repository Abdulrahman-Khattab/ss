require('express-async-errors');
require('dotenv').config();
const morgran = require('morgan');
const express = require('express');
const connectDB = require('./db/connect');
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRouter');
const reviewRouter = require('./routes/reviewRoutes');
const orderRouter = require('./routes/orderRoutes');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

const rateLimiter = require('express-rate-limit');
const xss = require('xss-clean');
const cors = require('cors');
const helemt = require('helmet');
const mongoSantize = require('express-mongo-sanitize');

const notFoundMiddleWare = require('./middleware/not-found');
const errorHandlerMiddleWare = require('./middleware/error-handler');

const app = express();

app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 100,
    max: 60,
  })
);

app.use(morgran('tiny'));
app.use(express.json());
app.use(cookieParser(process.env.jwt_Secret));
app.use(express.static('./public'));

app.use(fileUpload());

app.use(cors());
app.use(xss());
app.use(helemt());
app.use(mongoSantize());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/order', orderRouter);

app.get('/', (req, res) => {
  console.log(req.cookies);
  res.send('hello api app ');
});

app.get('/api/v1', (req, res) => {
  console.log(req.signedCookies);
  res.send('hello api app ');
});

app.use(notFoundMiddleWare);
app.use(errorHandlerMiddleWare);

const port = process.env.PORT || 5000;

const start = async () => {
  await connectDB(process.env.MONGO_URI);
  app.listen(port, () => {
    console.log('app listen to port 5000');
  });
};

start();
