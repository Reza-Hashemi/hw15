const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const config = require('./config/config');
const authRouter = require('./routes/auth');
const port = 2021;

mongoose.connect(config.mongoURL)

app.use(express.static(path.join(__dirname,'public')))

app.use(express.json());
app.use(express.urlencoded({extended:false}));



app.set("view engine", "ejs");
app.set("views", path.join(__dirname,'views'))


app.use('/auth',authRouter);







app.listen(port, function(){
    console.log("port is running on :",port);
})