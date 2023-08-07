const express = require('express');
const app = express();
const jsforce = require('jsforce');
require('dotenv').config();

const PORT = 8080;
const SOQL = `SELECT Id,Name FROM Contact LIMIT 1`;
const { SF_LOGIN_URL, SF_USERNAME, SF_PASSWORD, SF_TOKEN } = process.env;

const conn = new jsforce.Connection({
    loginUrl: SF_LOGIN_URL
});

conn.login(SF_USERNAME, SF_PASSWORD + SF_TOKEN, (err, userInfo) => {
    if (err) {
        console.error(err);
    } else {
        console.log("User Id: " + userInfo.id);
        console.log("Org Id:" + userInfo.organizationId);
    }
});

app.get('/', (req, res) => {
    conn.query(SOQL, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            console.log("Total records: " + result.totalSize);
            res.json(result.records);
        }
    })
});

app.get('/contacts', (req, res) => {
    conn.sobject("Contact")
        .select('*, Account.*') 
        .where({LastName:'Messi'})
        .limit(1)
        .execute((err, result) => {
            if (err) return console.error(err);
            // res.json(result.records);
            console.log(result.records);
        });
});



app.listen(PORT, () => console.log(`Server is running at http://localhost:${PORT}`));