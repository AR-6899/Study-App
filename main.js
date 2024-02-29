const express = require('express');
const mongoose = require('mongoose');
const Music = require('./models/music.model.js');
const Todo = require('./models/todolist.model.js');

const app = express();
const port = 3000;

mongoose.connect('mongodb://127.0.0.1/study')
    .then(() => {
        console.log("DB connected");
    })
    .catch(() => {
        console.log("DB connection failed");
    });

app.use('/public', express.static('public'));
app.use('/assets', express.static('assets'));
app.set('view engine', 'ejs');
app.use(express.json());

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/music/:album', async (req, res) => {
    let x = await Music.find({ Album: `${req.params.album}` }, { _id: 0 });
    res.json(x);
});

app.get('/todo', async (req, res) => {
    let x = await Todo.find({}, { _id: 0 });
    res.json(x);
});

app.get('/todo/:status', async (req, res) => {
    let x = await Todo.find({ isDone: `${req.params.status}` }, { _id: 0 });
    res.json(x);
});

app.put('/todo/update/:val', async (req, res) => {
    let desc = req.body.description;
    await Todo.updateOne({ description: `${desc}` }, { $set: { isDone: `${req.params.val}` } });
    res.json('task status updated');
});

app.delete('/todo/delete', async (req, res) => {
    let desc = req.body.description;
    await Todo.deleteOne({ description: `${desc}` });
    res.json('task deleted');
});

app.post('/todo/post', async (req, res) => {
    await Todo.create(req.body);
    res.json('task created');
});

app.listen(port, () => {
    console.log(`Server running at ${port}`);
});