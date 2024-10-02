// imports

const pg = require('pg')
const express = require('express');
require('dotenv').config()
// const auth = require("../api/helpers/auth")
// import { authenticate,findUserWithToken } from './auth';
// Static Routes
const client = new pg.Client(process.env.DATABASE_URL)
// App Routes
const app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
// Body Parsing Middleware
app.use(express.json());
app.use(require("morgan")("dev"))

// Add Access Control Allow Origin headers
app.all('*',(req, res, next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', '*');
    next();
  });
// app.use("/",(req, res, next) => {
//     console.log("adding access")
//     res.appendHeader("Access-Control-Allow-Headers", "http://localhost:5173");
//     // res.header(
//     //   "Access-Control-Allow-Headers",
//     //   "Origin, X-Requested-With, Content-Type, Accept"
//     // );
//     next();
//   });
// Api Routes
app.use("/api",require("../api"));

// Error Handling Middleware
app.use((error,req,res,next)=>{
    console.error(error.message)
    if (!error.status){error.status = 500}
    res.status(Math.floor((res.status))||error.status).send({error:error})
})

// Distribution Path Setup
const path = require('path');
app.get('/', (req, res)=> res.sendFile(path.join(__dirname, '../client/dist/index.html')))
app.use(express.static(path.join(__dirname, '../client/dist')));

// Init And Invocation
const init = async () => {
    await client.connect()
    console.log("CLIENT Connected")
    const port = process.env.PORT || 3000
    app.listen(port, () => console.log("listening on "+port));
}
init()
