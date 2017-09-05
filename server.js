const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const app = express();
const config = require('./config/database');

//connect to mongoose database with responses
mongoose.connect(config.database);
mongoose.connection.on('connected', () => {
	console.log('Connected to the database: ' + config.database);
});

mongoose.connection.on('error', (err) => {
	console.log('Database error: ' + err);
});

//fire packages
app.use(express.static(path.join(__dirname + "/public")));
app.use(bodyParser.json());
//cors middleware
app.use(cors());
//link users folder
const users = require('./routes/users');
app.use('/users', users);

//initialize passport
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

app.get('/', function(req, res){
	res.send('You\'ve hit something.');
});

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(3000, function(){
	console.log('MEAN auth app up and running.');
});