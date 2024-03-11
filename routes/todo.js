const express = require("express");
const router = express.Router();
const Todo = require('../models/todolist.model.js');

router
    .route('/')
    .get(async (req, res) => {
        let data = await Todo.find({}, { _id: 0 });
        return res.status(200).json(data);
    })
    .post(async (req, res) => {
        try {
            await Todo.create({
                description: req.body.description,
                isDone: req.body.isDone
            });
        } catch (e) {
            return res.status(400).json({ status: "task exists" });
        };
        return res.status(201).json({ status: "task created" });
    })
    .delete(async (req, res) => {
        await Todo.deleteOne({ description: req.body.description });
        return res.status(200).json({ status: "task deleted" });
    });

router
    .route('/:val')
    .get(async (req, res) => {
        let data = await Todo.find({ isDone: req.params.val }, { _id: 0 });
        return res.status(200).json(data);
    })
    .patch(async (req, res) => {
        await Todo.updateOne({ description: req.body.description }, { $set: { isDone: req.params.val } });
        return res.status(201).json({ status: "task status updated" });
    });

module.exports = router;