const express = require('express');
const router = express.Router();
const Book = require('../models/BookModel');


router.get('/', async (req, res) => {
  try {
    const books = await Book.find().lean();
    res.json(books);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const data = req.body;
    if (data.pagesRead == null) data.pagesRead = 0;
    const book = new Book(data);
    await book.save();
    res.status(201).json(book);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const update = req.body;
    const book = await Book.findByIdAndUpdate(id, update, { new: true });
    res.json(book);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
