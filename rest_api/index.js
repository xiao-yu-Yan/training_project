const express = require('express');
const app = express();
const PORT = 3000;

let users = [{ id1: 1, name: 'John Doe' },
{ id2: 2, name: 'Jane Smith' },
{ id3: 3, name: 'Alice Johnson' }];

app.use(express.json());
path = require('path');
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html')); // Serve the HTML file

});
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the 'public' directory
app.get('/users', (req, res) => {
    res.json(users);
});

app.post('/users', (req, res) => {
    const newUser = req.body;
    users.push(newUser);
    res.status(201).json(newUser);
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});