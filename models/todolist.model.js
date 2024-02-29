const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    description: { type: String, require: true },
    isDone: { type: Boolean, require: true }
});

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;