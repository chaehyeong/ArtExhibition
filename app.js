"use strict";

const express = require('express');
const ejs = require('ejs');
const app = express();
const port = 80;
const multer = require("multer");
const path = require("path");
var bodyParser = require('body-parser');

require('dotenv').config();

const mysql = require('mysql2');
const connection = mysql.createConnection(process.env.DATABASE_URL);
console.log('Connected to PlanetScale');

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/views`));
app.use(express.static(`${__dirname}/public`));

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/images/");
    },
    filename: function (req, file, cb) {
        cb(null, path.basename(file.originalname));
    }
})
var upload = multer({ storage: storage });

app.get('/', (req, res) => {
  res.render('index')
});

app.get('/upload', (req, res) => {
    res.render('upload')
});

app.post('/uploadProc', upload.single("image"), (req, res) => {
    const title = req.body.title;
    const name = req.body.name;
    const image = `/images/${req.file.filename}`;

    var sql = `insert into upload(title, name, image)
    values('${title}','${name}','${image}')`

    connection.query(sql, function (err, result){
        if(err) throw err;
        console.log('자료 1개를 삽입하였습니다');
        res.send("<script> alert('그림이 등록되었습니다'); location.href='/upload'</script>");
    });
});

app.get('/project', (req, res) => {
    var sql = `select * from upload`
    connection.query(sql, function (err, results, fields){
        if(err) throw err;
        res.render('project', {lists:results});
    })

});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});