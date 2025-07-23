const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const MOVIES_FILE = path.join(__dirname, 'movies.json');

// initialize movies.json if it doesn't exist
if (!fs.existsSync(MOVIES_FILE)) {
    fs.writeFileSync(MOVIES_FILE, JSON.stringify([
        { id: 1, name: "aaa", year: 1994 },
        { id: 2, name: "bbb", year: 1994 }
    ]));
}

// get all movies
app.get('/api/movies', (req, res) => {
    const movies = JSON.parse(fs.readFileSync(MOVIES_FILE));
    res.json(movies);
});

// add a new movie
app.post('/api/movies', (req, res) => {
    const movies = JSON.parse(fs.readFileSync(MOVIES_FILE));
    const newMovie = {
        id: movies.length > 0 ? Math.max(...movies.map(m => m.id)) + 1 : 1,
        name: req.body.name,
        year: req.body.year
    };
    movies.push(newMovie);
    fs.writeFileSync(MOVIES_FILE, JSON.stringify(movies, null, 2));
    res.status(201).json(newMovie);
});

app.listen(PORT, () => {
    console.log(`sever is running on http://localhost:${PORT}`);
});