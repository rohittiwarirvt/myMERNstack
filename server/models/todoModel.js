const mongoose = require('mongoose');
const todoSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Todo item is requied'],

  },
  is_complete: {
    type: Boolean,
    default: false,
  }
});


const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;