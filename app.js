var logfmt = require('logfmt');
var express = require('express');
var exphbs  = require('express-handlebars');
var pg = require('pg');

var app = express();
var conString = process.env.DATABASE_URL;

app.use('/public', express.static('public'));
app.engine('.hbs', exphbs({defaultLayout: 'index', extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('port', (process.env.PORT || 5000));


app.listen(app.get('port'), function() {
  console.log('Forse server is listening on port', app.get('port'));
});

app.get('/', function(request, response) {  
	response.render('layouts/index');
});

app.get('/api/tips/random', function(request, response) {
	pg.connect(conString, function(err, client, done) {
		if(err) {
    	return console.error('error fetching client from pool', err);
  	}

	  client.query('SELECT * FROM tips', function(err, result) {
	  	done();
	  	
	  	if(err) {
	    	return console.error(err);
	    }

      response.send(result.rows[Math.floor(Math.random() * result.rows.length)])
     });
  });
});

app.get('/api/tips', function(request, response) {
	pg.connect(conString, function(err, client, done) {
		if(err) {
    	return console.error('error fetching client from pool', err);
  	}

	  client.query('SELECT * FROM tips', function(err, result) {
	  	done();
	  	
	  	if(err) {
	    	return console.error(err);
	    }

      response.send(result.rows);
     });
  });
});