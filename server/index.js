// imports

const pg = require('pg')
const express = require('express');
require('dotenv').config()
// static routes
const client = new pg.Client(process.env.DATABASE_URL)
// app routes
const app = express();
// body parsing middleware
app.use(express.json());
app.use(require("morgan")("dev"))

//api routes
app.use("/api",require("../api"));

// error handling middleware
app.use((error,req,res,next)=>{
    res.status(Math.floor((res.status))||500).send({error:error})
})
// distribution path setup
const path = require('path');
app.get('/', (req, res)=> res.sendFile(path.join(__dirname, '../client/dist/index.html')))
app.use(express.static(path.join(__dirname, '../client/dist')));

// init and invocation
const init = async () => {
    await client.connect()
    console.log("CLIENT Connected")
    const port = process.env.PORT || 3000
    app.listen(port, () => console.log("listening on "+port));
}
init()
