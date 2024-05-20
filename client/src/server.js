const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createConnection({
    host: '73.236.81.141',
    user: 'root',
    password: 'ZQMPcorners',
    database: 'ticket_system',
    port: 3306
});

app.post('/submit_ticket', (req, res) => {
    const { email, description, severity } = req.body;
    const query = 'INSERT INTO tickets (email, description, severity) VALUES (?, ?, ?)';
    db.execute(query, [email, description, severity], (err, results) => {
        if (err) throw err;
        res.json({ message: 'Ticket submitted successfully', ticketId: results.insertId });
    });
});

app.listen(5001, () => {
    console.log('Server running on port 5001');
});
