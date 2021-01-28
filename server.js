const express = require('express');
const result = require('dotenv').config();
const bodyParser = require('body-parser');
const request = require('request');
const app = express();

if (result.error) {
    throw result.error;
}

const apiKey = process.env.API_KEY;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  res.render('index', {weather: null, error: null});
});

app.post('/', function (req, res) {
    let city = req.body.city;
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    request(url, function (err, response, body) {
        if(err){
            res.render('index', {weather: null, error: 'Error processing, please try again.'});
        } else {
            let weather = JSON.parse(body);
            if(weather.main == undefined || weather.main.feels_like == undefined){
                res.render('index', {weather: null, error: 'Error, please type a valid city.'});
            } else {
                let weatherText = `It's ${weather.main.temp} celsius degrees in ${weather.name}! But it feels like it's ${weather.main.feels_like} celsius.`;
                res.render('index', {weather: weatherText, error: null});
            }
        } 
    });
});