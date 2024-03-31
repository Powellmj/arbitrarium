const mongoose = require('mongoose');
const express = require('express')
const path = require('path')
const logger = require('morgan')
const db = require('./config/keys').mongoURI;

const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

if (process.env.NODE_ENV === 'production') {
	app.use(express.static('frontend/build'));
	app.get('/', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'frontend', 'build', '/index.html'));
	})
}

const routes = {
	"/items/": require('./api/routes/items'),
	"/contacts/": require('./api/routes/contacts'),
}

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running on port ${port}`));

mongoose
	.connect(db, { useUnifiedTopology: true, useNewUrlParser: true })
	.then(() => console.log("Connected to MongoDB successfully"))
	.catch(err => console.log(err));

app.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', true);
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);
	next();
})

app.use(logger('dev'))
Object.keys(routes).forEach(key => {
	app.use(key, routes[key])
})

app.use(function(err, req, res, next) {
  res.status(err.status || 500)
  res.send(err)
})

module.exports = app