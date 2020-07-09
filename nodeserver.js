//server.js
const express = require('express');
const path = require('path');
const port = process.env.PORT || 7070;
const app = express();

const cors = require('cors')
app.use(cors())

console.log(__dirname);
app.get('/', (req, res) => {
    app.use(express.static('landingpage'));
    res.sendFile(__dirname + '/landingpage/landing page.html');
})


app.get('/customerportal', (req, res) => {
  app.use('/customerportal', express.static('customerportal/frontend/'));
  res.sendFile(__dirname + '/customerportal/frontend/index.html');
})

app.get('/vendorportal', (req, res) => {
  app.use('/vendorportal',express.static('vendorportal/frontend/'));
  res.sendFile(__dirname + '/vendorportal/frontend/index.html');
})

app.get('/employeeportal', (req, res) => {
  app.use('/employeeportal',express.static('employeeportal/frontend/'));
  res.sendFile(__dirname + '/employeeportal/frontend/index.html');
})

app.get('/ehsmportal', (req, res) => {
  app.use('/ehsmportal',express.static('ehsmportal/frontend/'));
  res.sendFile(__dirname + '/ehsmportal/frontend/index.html');
})

app.get('/maintainanceportal', (req, res) => {
  app.use('/maintainanceportal',express.static('maintainanceportal/frontend/'));
  res.sendFile(__dirname + '/maintainanceportal/frontend/index.html');
})

app.get('/shopfloor', (req, res) => {
  app.use('/shopfloor',express.static('shopfloor/frontend/'));
  res.sendFile(__dirname + '/shopfloor/frontend/index.html');
})

app.get('/Qualityportal', (req, res) => {
  app.use('/Qualityportal',express.static('Qualityportal/frontend/'));
  res.sendFile(__dirname + '/Qualityportal/frontend/index.html');
})



app.listen(port, () => {
  console.log('boom ' + port);
});
