const express = require('express');
const path = require('path');

const app = express();

app.use(express.json());

app.use(express.urlencoded({extended:true}));

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));


const usersRoutes = require('./routes/users.routes');
app.use('/users',usersRoutes);

app.get('/',(req,res) => {
  res.send('Server is running. Go to /users');
})

module.exports = app;