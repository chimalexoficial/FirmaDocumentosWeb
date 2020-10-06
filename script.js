var express = require('express');
var app = express();
var fs = require('fs');
const multer = require('multer');
const path = require('path');


app.get('/', function (req, res) {
  res.sendFile('/Users/chimalex/Desktop/ITESO/9o_semestre/Redes 3/Doc_Web/index.html');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});



