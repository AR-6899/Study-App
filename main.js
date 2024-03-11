const express = require('express');
const mongoose = require('mongoose');
const todo_route = require('./routes/todo.js');
const Music = require('./models/music.model.js');

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
app.use(express.json());
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/music/:album', async (req, res) => {
    let data = await Music.find({ Album: `${req.params.album}` }, { _id: 0 });
    res.status(200).json(data);
});

app.use('/todo', todo_route);

app.listen(port, () => {
    console.log(`Server running at ${port}`);
});