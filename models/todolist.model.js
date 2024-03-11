const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    description: { type: String, required: true, unique: true },
    isDone: { type: Boolean, required: true }
});

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;