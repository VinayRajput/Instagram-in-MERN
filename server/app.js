const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const mongoose = require("mongoose");
const {MONGOURI} = require("./config/keys");
const log4js = require('log4js');

require('./models/user');
require("./models/post");

log4js.configure({
   appenders: { fileAppender: { type: 'file', filename: 'logs/stdout.log' } },
   categories: { default: { appenders: ['fileAppender'], level: 'info' } }
});
const logger = log4js.getLogger();
const {connection} = require("mongoose");
//mongoDB atlas password

mongoose.connect(MONGOURI, {})
    .then(connection=>{
       console.log(`Connected to mongodb`);
       logger.info('Connected to mongodb')
    });

mongoose.connection.on('error',()=>{
   console.log("error occurred in mongo connection");
})

app.use(express.json());
app.use(require("./routes/auth"));
app.use(require("./routes/post"));
app.use(require("./routes/user"));

// if(process.env.NODE_ENV == "production"){
//    app.use(express.static("client/build"))
//    const path = require("path");
//
//    app.get('/*', function(req, res) {
//        res.sendFile(path.join(__dirname, 'client',"build", 'index.html'));
//    });
// }

app.get("/", (req,res)=>{
   logger.info('request received on root')
   res.send("Apis for An-Instagram clone")
})

app.listen(PORT,()=>{
   logger.info(`server is running on ${PORT}`)
})