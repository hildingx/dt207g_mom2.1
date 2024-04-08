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

//Grundrutt för att visa välkomsmeddelande
app.get('/', (req, res) => {
    res.send('Välkommen till Alex CV-API!');
});

//Get - Hämta data från databas
app.get('/api/workexperiences', async (req, res) => {
    try {
        //Utför en SQL-fråga för att hämta alla arbetserfarenheter
        const result = await client.query('SELECT * FROM workexperiences;');
        //Skicka tillbaka resultaten som JSON
        return res.json(result.rows);
    } catch (err) {
        console.error('Fel vid hämtning från databasen:', err);
        res.status(500).json({ error: 'Ett fel uppstod vid hämtning av arbetserfarenheter.' });
    }
});

//Post - Infoga ny data i databas
app.post('/api/workexperiences', async (req, res) => {
    //Hämta egenskaper från objekt under bodyn
    const { companyname, jobtitle, location, startdate, enddate, description } = req.body;

    //Validera input så fält inte är tomma
    if (!companyname.trim() || !jobtitle.trim() || !location.trim() || !startdate.trim() || !enddate.trim() || !description.trim()) {
        return res.status(400).json({ error: 'Alla fält måste vara ifyllda.' });
    }

    //Infoga ny arbetserfarenhet i db tabell med parametriserade frågopr
    try {
        //Utför en SQL-fråga för att inserta ny arbetserfarenhet
        const query = await client.query(`
            INSERT INTO workexperiences (companyname, jobtitle, location, startdate, enddate, description)
            VALUES ($1, $2, $3, $4, $5, $6)
        `, [companyname, jobtitle, location, startdate, enddate, description]);

        res.status(201).json({ message: 'Ny arbetserfarenhet skapad' });
    } catch (err) {
        console.error('Fel vid infogning i databasen:', err);
        res.send('Ett fel uppstod');
    }
});

//PUT - Uppdatera befintlig data i databas
app.put('/api/workexperiences/:id', async (req, res) => {
     //Hämta specifikt id
    const id = req.params.id;
    const { companyname, jobtitle, location, startdate, enddate, description } = req.body;

    // Kontrollera att inga fält är tomma
    if (!companyname.trim() || !jobtitle.trim() || !location.trim() || !startdate.trim() || !enddate.trim() || !description.trim()) {
        return res.status(400).json({ error: 'Alla fält måste vara ifyllda.' });
    }

    try {
        //Uppdatera arbetserfarenheten i databasen med nya värden
        const result = await client.query(
            'UPDATE workexperiences SET companyname = $1, jobtitle = $2, location = $3, startdate = $4, enddate = $5, description = $6 WHERE id = $7 RETURNING *',
            [companyname, jobtitle, location, startdate, enddate, description, id]
        );

        //Kontrollera om uppdateringen påverkade någon rad
        if (result.rowCount === 0) {
            //Om ingen rad påverkas
            return res.status(404).json({ message: 'Ingen arbetserfarenhet hittades med det angivna ID:t.' });
        }

        //Svara med den uppdaterade arbetserfarenheten
        res.json({ message: 'Arbetserfarenheten uppdaterad med id ' + id, data: result.rows[0] });
    } catch (err) {
        console.error('Fel vid ändring av post i databasen:', err.message);
        res.status(500).json({ error: 'Ett fel uppstod vid ändring av arbetserfarenheten.' });
    }
});

//DELETE
app.delete('/api/workexperiences/:id', async (req, res) => {
    //Hämta specifikt id
    const id = req.params.id;

    //Ta bort arbetserfarenhet från tabell med givet id
    try {
        const result = await client.query('DELETE FROM workexperiences WHERE id = $1', [id]);
        
        //Kontrollera om någon rad deletades
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Ingen post hittades med det angivna ID:t. Ingen post togs bort.' });
        }
        res.status(200).json({ message: 'Posten har tagits bort.' });
    } catch (err) {
        console.error('Fel vid borttagning från databasen:', err.message);
        return res.status(500).json({ error: 'Ett fel uppstod vid borttagning av arbetserfarenheten.' });
    }
});

// Definiera porten, använd miljövariabeln PORT eller standardvärdet 3000
const port = process.env.PORT || 3000;

//Starta express-server
app.listen(port, () => {
    console.log('Server is running on port: ' + port);
});