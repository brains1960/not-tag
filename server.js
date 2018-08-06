const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const app = express();
const mongoose = require('mongoose');

mongoose.connect(process.env.MLAB, { useNewUrlParser: true });

const Player = mongoose.model('Player', {
  name: String,
  latitude: String,
  longitude: String,
  zombie: Boolean
  // game: {
  //   type: mongoose.Schema.ObjectId,
  //   ref: 'Game'
  // }
})

const Game = mongoose.model('Game', {
  gameName: String,
  state: Boolean,
  time: Number,
  password: String,
  currUser: String,
  players: {
    type: Array,
  }
})

const entryPass = mongoose.model('entryPass', {
  password: String
})

app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.json())

// routes
// Create a new player
app.post('/player/create', function (req, res) {
  Player.findOne({ name: req.body.name }, (err, player) => {
    if (err) {
      res.send(err)
    } else if (player) {
      res.json({id: player._id, name: player.name, latitude: player.latitude,
      longitude: player.longitude, zombie: player.zombie });
    } else {
      new Player(req.body)
        .save()
        .then((doc) => {
          res.json({id: doc._id, name: doc.name, latitude: doc.latitude,
        longitude: doc.longitude, zombie: false})
        // res.json(doc)
      })
      .catch((err) => res.status(500).end(err.message))
    }
  })
  .catch((err) => res.status(500).end(err.message))
});

// display current players
// app.get('/game/:id', function (req, res) {
//   //Populating players here might be helpful to filter on the frontend <-----
//   Player.find({game: req.params.id}, (err, docs) => {
//     // req.params.id
//     if(err) res.status(500).end(err.message)
//     else {
//       res.json(docs)
//     }
//   })
// });

//make a new game
app.post('/game/create', function (req, res) {
  new Game({
    gameName: req.body.gameName,
    state: false,
    time: req.body.time,
    password: req.body.password,
    currUser: req.body.currUser,
    players: req.body.players})
    .save()
    .then((doc) => {
      res.json({
      id: doc._id,
      gameName: doc.gameName,
      time: doc.time,
      currUser: doc.currUser,
      password: doc.password,
      players: doc.players
    })})
    .catch((err) => {
      console.log(err)
      res.status(500).end(err.message)
    })
});

//join existing game
app.post('/game/enter', function (req, res) {
  Game.findOne({password: req.body.password, gameName: req.body.gameName}, function(err, room){
    /// update game to have this new player???
    let players = room.players.slice()
    players.push({
      name: req.body.currUser.username,
      id: req.body.currUser.id,
      latitude: req.body.currUser.latitude,
      longitude: req.body.currUser.longitude,
    });

    let inRoom = room.players.filter((item) => item.id === req.body.currUser.id)

    if(inRoom.length === 0){
      Game.findOneAndUpdate({password: req.body.password, gameName: req.body.gameName}, {players:players}, {new : true})
      .then(doc => {
        res.json(doc)})
      .catch((err) => {
        console.log(err)
        res.status(500).end(err.message)})
    } else {
      res.json(room)
    }
  })

})

app.get('/game/start/:id', function(req, res){
  Game.findByIdAndUpdate(req.params.id, {state: true}, {new: true})
  .then(doc => {
    res.json(doc)
  })
  .catch(err => console.log('Game Start', err))
})

app.get('/player/:id', function (req,res){
  Player.findById(req.params.id)
   .exec(function(error, response){
    if(error) res.status(500).end(error.message)
    else res.json(response)
  })
})

app.get('/game/:id', function (req,res){
  Game.findById(req.params.id)
   .exec(function(error, response){
    if(error) {res.status(500).end(error.message)}
    else {
      console.log(response)
      res.json(response)
    }
  })
})

/// tag who is a zombie
app.get('/player/status/:id', function (req,res){
  Player.findByIdAndUpdate(req.params.id, {zombie: true})
   .exec(function(error, response){
    if(error) res.status(500).end(error.message)
    //would like this to send back all players <---- can remove comment when done
    else res.json(response)
  })
})

// Update Locations
app.post('/player/location/:id', function(req, res){
  Player.findByIdAndUpdate(req.params.id, {longitude : req.body.longitude,
                                            latitude: req.body.latitude })
  .exec(function(err, resp){
    if(err) res.status(500).end(err.message)
    //would like this to send back all players <---- can remove comment when done
    else res.json(resp)
  })
})

//send invite
app.post('/invite', function(req, res){
  const accountSid = 'AC2857c7236f874ddb5875fa9fa4b6a50e';
  const authToken = process.env.TWILIOTOKEN;
  const client = require('twilio')(accountSid, authToken);

  client.messages
    .create({
       body: req.body.body,
       from: '+12109609363',
       to: req.body.to
     })
    .then(message => console.log(message.sid))
    .done();
})


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname,  './public/index.html'));
});

app.listen(process.env.PORT || 1337);
console.log('Server Listening on '+(process.env.PORT || '1337'));
