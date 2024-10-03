// imports
require('dotenv').config()


const express = require('express');
// Static Routes
const client = require('./client/client.cjs');
client.connect();
// App Routes
const path = require('path');
const app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
// Body Parsing Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));
// app.use(require("morgan")("dev"))

// Add Access Control Allow Origin headers
app.all('*',(req, res, next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', '*');
    next();
  });
// Api Routes
// app.use("/api",require("../api/index.js"));

// Error Handling Middleware
app.use((error,req,res,next)=>{
    console.error(error.message)
    if (!error.status){error.status = 500}
    res.status(Math.floor((res.status))||error.status).send({error:error})
})

// Distribution Path Setup


app.get('*', (req, res, next)=> {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

// Init And Invocation

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {console.log(`We are listening on port ${PORT}`);
});
