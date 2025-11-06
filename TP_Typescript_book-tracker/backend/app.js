const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const booksRouter = require('./routes/books');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/book_tracker')
  .then(()=>console.log('Connected to MongoDB'))
  .catch(err=>console.error(err));

app.use(cors({
  origin: '*',
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/books', booksRouter);

app.listen(4000, ()=>console.log('Backend listening on 4000'));
