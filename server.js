var express = require('express'),
  app = express();



var countries = require('./countries.json'),
	capitals = countries.map(function (c) {
		return c.capital;
	}),
	countriesList = countries.map(function (c) {
		return c.country;
	});

var latency = false;

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendfile('/public/index.html');
});

app.get('/cities', function(req, res){
	send(function () {
		res.send(JSON.stringify(capitals));
	})
});

app.post('/register', function (req, res) {
	send(function () {
		res.status(200).end()
	})
});

app.post('/edit', function (req, res) {
	send(function () {
		res.status(200).end()
	})
})

app.get('/latency', function (req, res) {
	send(function () {
		res.status(200).end()
	})
	latency = req.param('latency');
})

app.get('/latencyStatus', function (req, res) {
	send(function () {
		res.status(200).send(latency).end()
	})
})

var docs = require('./docs.json')
app.get('/documents', function (req, res) {
	send(function () {
		res.send(JSON.stringify(docs));
	})
})


function send (fn, ctx) {
	var lat = 1500;
	setTimeout(fn.bind(ctx || this), +latency ? lat : 0)
}

app.listen(process.env.PORT || 3000);