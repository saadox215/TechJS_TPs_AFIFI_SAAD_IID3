const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: String,
  pages: { type: Number, required: true },
  status: { type: String, enum: ['Read','Re-read','DNF','Currently reading','Returned Unread','Want to read'], default: 'Want to read' },
  price: { type: Number, default: 0 },
  pagesRead: { type: Number, default: 0 },
  format: { type: String, enum: ['Print','PDF','Ebook','AudioBook'], default: 'Print' },
  suggestedBy: String,
  finished: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// marque as finished
BookSchema.pre('save', function(next) {
  if (this.pagesRead >= this.pages) this.finished = true;
  else this.finished = false;
  next();
});

module.exports = mongoose.model('Book', BookSchema);
