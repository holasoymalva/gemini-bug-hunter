/**
 * Sample Vulnerable Code for Testing
 * DO NOT USE IN PRODUCTION
 */

const express = require('express');
const mysql = require('mysql');
const app = express();

// VULNERABILITY 1: Hardcoded credentials
const db = mysql.createConnection({
    host: 'localhost',
    user: 'admin',
    password: 'SuperSecret123!',
    database: 'myapp'
});

// VULNERABILITY 2: SQL Injection - FIXED
app.get('/user/:id', (req, res) => {
    const userId = req.params.id;
    // Using a parameterized query to prevent SQL Injection
    db.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.json(results);
    });
});

// VULNERABILITY 3: XSS (Cross-Site Scripting)
app.get('/search', (req, res) => {
    const searchTerm = req.query.q;
    res.send(`<h1>Search results for: ${searchTerm}</h1>`);
});

// VULNERABILITY 4: Command Injection
const { exec } = require('child_process');

app.get('/ping', (req, res) => {
    const host = req.query.host;
    exec(`ping -c 4 ${host}`, (error, stdout) => {
        res.send(stdout);
    });
});

// VULNERABILITY 5: Insecure Direct Object Reference
app.get('/file', (req, res) => {
    const filename = req.query.name;
    res.sendFile(`/uploads/${filename}`);
});

// VULNERABILITY 6: Weak cryptography
const crypto = require('crypto');

function hashPassword(password) {
    return crypto.createHash('md5').update(password).digest('hex');
}

// VULNERABILITY 7: Missing authentication
app.get('/admin/users', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        res.json(results);
    });
});

// VULNERABILITY 8: Sensitive data in logs
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    console.log(`Login attempt: ${username} with password: ${password}`);
    // ... authentication logic
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});