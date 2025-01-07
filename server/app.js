const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;
const mongoose = require("mongoose");
const {MONGOURI} = require("./config/keys");

require('./models/user');
require("./models/post");
const {connection} = require("mongoose");
//mongoDB atlas password

mongoose.connect(MONGOURI, {})
    .then(connection=>console.log(`Connected to mongodb`));

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
   console.log('home')
   res.send("Apis for An-Instagram clone")
})

app.listen(PORT,()=>{
   console.log(`server is running on ${PORT}`)
})