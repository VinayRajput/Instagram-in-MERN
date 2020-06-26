const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const mongoose = require("mongoose");
const {MONGOURI} = require("./config/keys");

require('./models/user');
require("./models/post");
//mongoDB atlas password

mongoose.connect(MONGOURI, {useNewUrlParser:true, useUnifiedTopology:true})
mongoose.connection.on('connected',()=>{
   console.log("connected to mongo");
})

mongoose.connection.on('error',()=>{
   console.log("error occured in mnongo connection");
})

app.use(express.json());
app.use(require("./routes/auth"));
app.use(require("./routes/post"));
app.use(require("./routes/user"));

if(process.env.NODE_ENV == "production"){
   app.use(express.static("client/build"))
   const path = require("path");
   app.get("*", (req,res)=>{
      res.sendFile(path.resolve(__dirname,"client","build","index.html "))
   })

}

app.get("/", (req,res)=>{
   console.log('home')
   res.send("Hello world!")
})

app.listen(PORT,()=>{
   console.log(`server is running on ${PORT}`)
})