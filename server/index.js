// imports
const pg = require('pg')
const express = require('express');
require('dotenv').config()
// static routes
const client = new pg.Client(process.env.DATABASE_URL)
// app routes
const app = express();
app.use(express.json());
// distribution path setup
const path = require('path');
app.get('/', (req, res)=> res.sendFile(path.join(__dirname, '../client/dist/index.html')))
app.use(express.static(path.join(__dirname, '../client/dist')));

// init and invocation
const init = async () => {
    await client.connect()
    console.log("CLIENT Connected")
    await client.query(SQL)
    const port = process.env.PORT || 3000
    app.listen(port, () => console.log("listening on "+port));
}
init()