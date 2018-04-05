const express = require("express");
const app = express();
const scriptPath = './public/script/'
const login = require(scriptPath + 'method.js').login
const updateUser = require(scriptPath + 'method.js').updateUser
const createUser = require(scriptPath + 'method.js').createUser
const addteam = require(scriptPath + 'method.js').addTeam
const showInfo = require(scriptPath + 'method.js').showInfo
const deleteTeam = require(scriptPath + 'method.js').deleteTeam
const bodyParser = require('body-parser')


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', '.');

// app.all('/', function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "X-Requested-With");
//   next()
// });


app.get("/", function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.sendfile('./public/authenticate.html')
});

app.get("/secondView", function(req, res) {
  // res.render('public/secondView', {input: req.query})
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.sendfile('./public/secondView.html')
});

app.get("/thirdView", function(req, res) {
    res.sendfile('./public/thirdView.html')
});

// create a new user
app.post('/signup', function (req, res) {
  createUser(req.body.id,req.body.name, function(result){
  	res.send(result)
  })
})

// log in a user
app.post('/login', function (req, res) {
  login(req.body.id, function(result){
  	res.send(result)
  })
})

// get user's name
app.get('/user/:id/name', function (req, res) {
    showInfo(req.params.id, function(result){
		res.send(result)
	})
})

// update user's name
app.put('/user/:id/name', function (req, res) {
  updateUser(req.params.id, req.body.newName, function(result){
	res.send(result)
  });
});

// get user's favorites
app.get('/user/:id/favorite', function(req, res){
	showInfo(req.params.id, function(result){
		res.send(result)
	})
})

// add a team to user's favorites
app.post('/user/:id/favorite/:team', function (req, res) {
  addteam(req.params.id, req.params.team, function(result){
  	res.send(result)
  })
})

// delete a team from user's favorites
app.delete('/user/:id/favorite/:team', function(req, res){
console.log("reached delete request")
	deleteTeam(req.params.id, req.params.team)
})

app.listen(4000, function() {
 console.log("Listening on " + 4000);
});
