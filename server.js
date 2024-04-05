//Importera PostgreSQL-klienten från pg-paketet
const { Client } = require("pg");
//Importera express från express-paketet
const express = require("express");
//Ladda miljövariabler från .env-filen
require("dotenv").config();
// Konfigurera express-mellanprogram (middleware) för förfrågningshantering
const cors = require('cors');
//Initiera ny express app
const app = express();

//Aktivera CORS för alla förfrågningar
app.use(cors());
//Parsa JSON-kroppar i inkommande förfrågningar
app.use(express.json());
//Hantera URL-kodade kroppar
//app.use(express.urlencoded({ extended: true }));

//Konfigurera PostgreSQL-databasklienten
const client = new Client ({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    //Ej krypterat
    ssl: {
        rejectUnauthorized: false,
    },
});

//Anslut till PostgreSQL-databasen
client.connect((err) => {
    if(err) {
        console.log("Fel vid anslutning: " + err);
    } else {
        console.log("Ansluten till databas");
    }
});

app.get('/api', (req, res) => {
    res.json({ message: 'Welcome to my REST API' });
});

app.get('/api/workexperiences', (req, res) => {
    res.json({ message: 'GET request to api/users' });
});

//POST
app.post('/api/workexperiences', (req, res) => {
    res.json({ message: 'POST request to api/users' });
});

//PUT
app.put('/api/workexperiences/:id', (req, res) => {
    res.json({ message: 'PUT request to /users - with id: ' + req.params.id });
});

//DELETE
app.delete('/api/workexperiences/:id', (req, res) => {
    res.json({ message: 'DELETE request to /users - with id: ' + req.params.id });
});

// Definiera porten, använd miljövariabeln PORT eller standardvärdet 3000
const port = 3000;

app.listen(port, () => {
    console.log('Server is running on port: ' + port);
});