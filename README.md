

# REST-Webbtjänst
***Av Alexander Hilding***
## Arbetsgång
 * Skapat postgreSQL databas dt207g_mom2 via render.
 * Anslutit till databasen med pgadmin för bättre översikt av databas.
 * Initierat npm-projekt.
 * Installerat paket -
	* express, webbappram för att skapa server som kan ta emot och hantera http-förfrågningar
	* pg, paket för anslutning till postgresql-databas.
	* dotenv --save-dev, paket för att hantera miljövariabler
	* cors, paket som tillhandlahåller en connect/express middleware för att aktivera CORS
	* nodemon, verktyg för att automatiskt starta om applikationen vid upptäckt av filändring
* Använt thunderclient som plug-in i vscode för att testa API-anrop direkt i utvecklingsmiljön.
* Satt upp git-repo
* Satt upp en install.js
    * Importerat PostgreSQL-klienten från pg-paketet
    * Laddat miljövariabler från .env-filen
    * Konfigurerat PostgreSQL-databasklienten
    * Anslutit till PostgreSQL-databasen med client.connect.
    * Skapat tabell workexperience med client.query.
    I tabellen finns kolumnerna id, companyname, jobtitle, location, startdate, enddate, description samt definierad lämplig datatyp. Id är satt som primärnyckel.
* Initierat server.js med grundläggande setup och API-rutter, samt skapat index.html för test av fetchanrop till API't.
* Testat API med thunderclient.
* Skrivit funktioner för CRUD (funktioner för att hantera data i en databas) för respektive rutt (get, post, put och delete).
	* Get-rutt utför SQL-förfrågan för att hämta alla lagrade arbetserfarenheter och returnerar som JSON.
	* Post-rutt utför SQL-förfrågan som hämtar objekt med input-data och insertar i databas.
	* Put-rutt utför SQL_förfrågan som uppdaterar befintilig post i tabellen.
	* Delete-rutt utför SLQ-förfrågan och tar bort angiven rad i tabellen utifrån ID't.
* Publicerat webbtjänsten på Render.
https://dt207g-mom2-1.onrender.com/api/workexperiences ger listan i JSON-format över alla arbetserfarenheter
som för närvarande är lagrade i databasen. Varje objekt i listan representerar en unik arbetserfarenhet,
med egenskaperna företagsnamn, jobbtitel, arbetsplats, anställningsperiod och beskrivning.

## Länk
API'et finns tillgänglig på https://dt207g-mom2-1.onrender.com/api/workexperiences

## Installation, databas
API'et använder postgreSQL databas.
Klona ner källkodsfilerna, kör kommando npm install för att installera nödvändiga npm-paket. Kör installations-skriptet install.js. Installations-skriptet skapar databastabeller enligt nedanstående:
| Tabell-namn | Fält  |
|--|--|
| workexperiences| id(serial PK), companyname (varchar(255)), jobtitle (varchar(64)), location (varchar(255)), startdate (date), enddate (date), description (text), created_at (timestamp default current_timestamp) |

## Användning
Såhär når du API'et.
| Metod |Ändpunkt  |Beskrivning  |
|--|--|--|
| GET | api/workexperiences | Hämtar alla tillgängliga arbetserfarenheter |
| GET | api/workexperiences/{id} | Hämtar specifik arbetserfarenhet med angivet ID |
| POST | api/workexperiences | Lagrar ny arbetserfarenhet |
| PUT | api/workexperiences/{id} | Uppdaterar existerande arbetserfarenhet med angivet ID  |
| DELETE | api/workexperiences/{id} | Tar bort arbetserfarenhet med angiet ID |

Strukturen på ett arbetserfarenhet-objekt ser ut som följer i JSON:

      
    {
	    "companyname": "1337 AB",
	    "jobtitle": "Leet-expert",
	    "location": "Stockholm",
	    "startdate": "2021-01-01",
	    "enddate": "2022-12-31",
	    "description": "Krigade med BBS'er morgon till kväll"
    }
