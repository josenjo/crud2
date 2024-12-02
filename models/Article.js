const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleSchema = new Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  title: String,
  slug: String,
  photo: String,
  content: String,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('Article', articleSchema);
