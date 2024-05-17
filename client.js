// client.js
const socket = io();

document.addEventListener('click', logActivity);
document.addEventListener('scroll', logActivity);
document.addEventListener('keydown', logActivity);

function logActivity(event) {
    const activity = {
        type: event.type,
        timestamp: new Date().toISOString(),
    };
    sendActivityToServer(activity);
}

function sendActivityToServer(activity) {
    socket.emit('userActivity', activity);
}

socket.on('suggestion', function(suggestion) {
    displaySuggestion(suggestion);
});

function displaySuggestion(suggestion) {
    document.getElementById('suggestion').innerText = suggestion;
}
