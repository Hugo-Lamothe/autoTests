const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
app.use(express.json());

const dataFilePath = path.join(__dirname, 'tasks.json');

// Lire les tâches depuis le fichier
const readTasksFromFile = () => {
    if (fs.existsSync(dataFilePath)) {
        const data = fs.readFileSync(dataFilePath, 'utf-8');
        return JSON.parse(data);
    }
    return [];
};

// Écrire les tâches dans le fichier
const writeTasksToFile = (tasks) => {
    fs.writeFileSync(dataFilePath, JSON.stringify(tasks, null, 2), 'utf-8');
};

let tasks = readTasksFromFile();
let id = tasks.length ? Math.max(...tasks.map(task => task.id)) + 1 : 1;

app.get('/tasks', (req, res) => {
    res.json(tasks);
});

app.post('/tasks', (req, res) => {
    const task = { id: id++, ...req.body };
    tasks.push(task);
    writeTasksToFile(tasks);
    res.status(201).json(task);
});

app.put('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    const taskIndex = tasks.findIndex(task => task.id === taskId);

    if (taskIndex !== -1) {
        tasks[taskIndex] = { ...tasks[taskIndex], ...req.body };
        writeTasksToFile(tasks);
        res.json(tasks[taskIndex]);
    } else {
        res.status(404).json({ message: 'Task not found' });
    }
});

app.delete('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    const taskIndex = tasks.findIndex(task => task.id === taskId);

    if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
        writeTasksToFile(tasks);
        res.status(204).send();
    } else {
        res.status(404).json({ message: 'Task not found' });
    }
});

module.exports = app;