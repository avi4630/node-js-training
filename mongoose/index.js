const express = require('express');
const bodyParser = require('body-parser');
const dbConfig = require('./config.js');
const mongoose = require('mongoose');
const http=require('http');
const app = express();
const PORT=process.env.PORT || 3005
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse requests of content-type - application/json
app.use(bodyParser.json())

const routerObj = require('./userRout');
app.use('/',routerObj);

mongoose.Promise = global.Promise;
// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

http.createServer(app).listen(PORT, () => {
    console.log("Server is listening on port");
});


