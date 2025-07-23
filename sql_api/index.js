const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');
const { error } = require('console');

const app = express();
const port = 3000;

//Db connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'n3u3da!',
    database: 'myapp'
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('MySQL Connected...'); 
});

// Middleware
app.use(bodyParser.json()); 
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from public directory

// Routes
app.get('/users', (req, res) => {
    const sql = 'SELECT * FROM users';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching users:', err);
            res.status(500).send('Server error');
            return;
        }
        res.json(results);
    });
});

// Post a new user
app.post('/users', (req, res) => {
    const{name}=req.body;
    if (!name) {
        return res.status(400).send('Name is required');
    }
    // Insert user into the database
    const sql = 'INSERT INTO users (name) VALUES (?)';
    db.query(sql, [name], (err, result) => {
        if (err) {
            console.error('Error inserting user:', err);
            res.status(500).send('Server error');
            return;
        }
        res.status(201).json({ id: result.insertId, name });
    });
    const id = req.params.id;
});

// Update a user
app.put('/users/:id', (req, res) => {
    const id = req.params.id;
    const { name } = req.body;
    if (!name) {
        return res.status(400).json('Name is required');
    }
    // Update user in the database
    const sql = 'UPDATE users SET name = ? WHERE id = ?';
    db.query(sql, [name, id], (err, result) => {
        if (err) {
            console.error('Error updating user:', err);
            res.status(500).json('Server error');
            return;
        }
        if (result.affectedRows === 0) {
            return res.status(404).json('User not found');
        }
        res.json({ id, name });
    });
});

// Delete a user
app.delete('/users/:id', (req, res) => {    
    const id = req.params.id;
    // Delete user from the database
    const sql = 'DELETE FROM users WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error deleting user:', err);
            res.status(500).json({error:'Server error'});
            return;
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({error:'User not found'});
        }
        res.json({ message: 'User deleted successfully' });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
