const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const app = express();
const mongoose = require('mongoose');

mongoose.connect(process.env.MLAB);

const Player = mongoose.model('Player', {
  name: String,
  game: {
    type: mongoose.Schema.ObjectId,
    ref: 'Game'
  }
})

const Game = mongoose.model('Game', {
  gameName: String,
  state: String,
  time: Number,
  password: String,
  players: [{type: Schema.ObjectId, ref: "Player"}]
})

const entryPass = mongoose.model('entryPass', {
  password: String
})

app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.json())

// routes
// Create a new player
app.post('/player/create', function (req, res) {
  new Player(req.body)
    .save()
    .then((doc) => res.json({id: doc.id, name: doc.name}))
    .catch((err) => res.status(500).end(err.message))
});

// display current players
app.get('/game/:id', function (req, res) {
  Player.find({game: req.params.id}, (err, docs) => {
    // req.params.id
    if(err) res.status(500).end(err.message)
    else {
      res.json(docs)
    }
  })
});

//make a new game
app.post('/game/create', function (req, res) {
  new Game(req.body)
    .save()
    .then((doc) => res.json({
      id: doc.id,
      gameName: doc.gameName,
      time: doc.time,
      password: doc.password,
      players: doc.players
    }))
    .catch((err) => res.status(500).end(err.message))
});

//join existing game
app.post('/game/enter', function (req, res) {
  Game.findOneAndUpdate({password: req.body.password}, {
    players:[...players, req.body._id]
  })
  /// update game to have this new player???
  .then(doc => {
    console.log("updated")
  })
  .catch((err) => res.status(500).end(err.message))
})

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname,  './public/index.html'));
});

app.listen(process.env.PORT || 1337);
