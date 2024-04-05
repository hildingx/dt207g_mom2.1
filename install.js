//Importera PostgreSQL-klienten från pg-paketet
const { Client } = require("pg");
//Ladda miljövariabler från .env-filen
require("dotenv").config();

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

//Skapa tabell
client.query(`
    DROP TABLE IF EXISTS courses;
    CREATE TABLE workexperience(
        id SERIAL PRIMARY KEY,
        companyname VARCHAR(255),
        jobtitle VARCHAR(64),
        location VARCHAR(255),
        startdate DATE,
        enddate DATE,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`, (err, res) => {
    if (err) {
        console.error("Fel vid skapande av tabell:", err.stack);
    } else {
        console.log("Tabellen skapad");
    }
});