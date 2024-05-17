// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

mongoose.connect('mongodb://localhost/activityDB', { useNewUrlParser: true, useUnifiedTopology: true });

const activitySchema = new mongoose.Schema({
    type: String,
    timestamp: Date,
    // Additional fields as needed
});

const Activity = mongoose.model('Activity', activitySchema);

app.use(express.static(__dirname));

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('userActivity', (activity) => {
        console.log('Activity received:', activity);
        saveActivity(activity);
        const suggestion = generateSuggestion(activity);
        socket.emit('suggestion', suggestion);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

function saveActivity(activity) {
    const newActivity = new Activity(activity);
    newActivity.save();
}

function generateSuggestion(activity) {
    switch (activity.type) {
        case 'click':
            return 'You clicked something!';
        case 'scroll':
            return 'You scrolled the page!';
        case 'keydown':
            return 'You pressed a key!';
        default:
            return 'Keep interacting!';
    }
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
