var express = require('express'),
  app = express();



var countries = require('./countries.json'),
	capitals = countries.map(function (c) {
		return c.capital;
	}),
	countriesList = countries.map(function (c) {
		return c.country;
	});


app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendfile('/public/index.html');
});

app.get('/cities', function(req, res){
  res.send(JSON.stringify(capitals));
});

app.post('/register', function (req, res) {
	res.status(200).end()
});


app.listen(3000);