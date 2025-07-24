const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

// MySQL database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'n3u3da!',
    database: 'movie_db'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Create movies table if it doesn't exist
db.query(`
    CREATE TABLE IF NOT EXISTS movies (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        year INT NOT NULL,
        director VARCHAR(255) NOT NULL,
        genre VARCHAR(255) NOT NULL,
        rating DECIMAL(3,1) NOT NULL
    )
`, (err) => {
    if (err) throw err;
    console.log('Movies table ready');
});

// API Routes

// Get all movies or search by title
app.get('/api/movies', (req, res) => {
    const searchTerm = req.query.search;
    
    let query = 'SELECT * FROM movies';
    const params = [];
    
    if (searchTerm) {
        query += ' WHERE title LIKE ?';
        params.push(`%${searchTerm}%`);
    }
    
    query += ' ORDER BY title';
    
    db.query(query, params, (err, results) => {
        if (err) {
            console.error('Error fetching movies:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

// Add a new movie
app.post('/api/movies', (req, res) => {
    const { title, year, director, genre, rating } = req.body;
    
    if (!title || !year || !director || !genre || !rating) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    
    const query = 'INSERT INTO movies (title, year, director, genre, rating) VALUES (?, ?, ?, ?, ?)';
    const params = [title, year, director, genre, rating];
    
    db.query(query, params, (err, result) => {
        if (err) {
            console.error('Error adding movie:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(201).json({ id: result.insertId, ...req.body });
    });
});

// Update a movie
app.put('/api/movies/:id', (req, res) => {
    const movieId = req.params.id;
    const { title, year, director, genre, rating } = req.body;
    
    if (!title || !year || !director || !genre || !rating) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    
    const query = 'UPDATE movies SET title = ?, year = ?, director = ?, genre = ?, rating = ? WHERE id = ?';
    const params = [title, year, director, genre, rating, movieId];
    
    db.query(query, params, (err, result) => {
        if (err) {
            console.error('Error updating movie:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        res.json({ id: movieId, ...req.body });
    });
});

// Delete a movie
app.delete('/api/movies/:id', (req, res) => {
    const movieId = req.params.id;
    
    const query = 'DELETE FROM movies WHERE id = ?';
    
    db.query(query, [movieId], (err, result) => {
        if (err) {
            console.error('Error deleting movie:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        res.json({ message: 'Movie deleted successfully' });
    });
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});