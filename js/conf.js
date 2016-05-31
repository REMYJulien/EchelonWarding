var Datastore = require('nedb')
, db = new Datastore({ filename: './database/db.json', autoload: true });

function see_competition()
{
  var competitions = ""
  db.find({competition:/.*/}, function (err, docs) {
      for (var i = 0; i < docs.length; i++) {
        competitions = competitions + "<tr class=\"center aligned\"><td>"+docs[i].competition
        +"</td><td>"+"<button type=\"button\" class=\"ui button inverted orange delete_comp\" id=\""+docs[i]._id
        +"\">Delete</button>" +"</td></tr>"
      }
      document.getElementById('list_competition').innerHTML = competitions
      var x = document.getElementsByClassName("delete_comp")
      for (var i = 0; i < x.length; i++) {
          x[i].addEventListener('click', delete_competition, false)
      }
  });
}

function see_player()
{
  var players = ""
  db.find({player:/.*/}).sort({ team:1 }).exec(function (err, docs) {
    for (var i = 0; i < docs.length; i++) {
      players = players + "<tr class=\"center aligned\"><td>"+docs[i].player+"</td><td>"+docs[i].team
      +"</td><td>"+"<button type=\"button\" class=\" ui button inverted orange delete_player\" id=\""+docs[i]._id
      +"\">Delete</button>" +"</td></tr>"
    }
    document.getElementById('list_player').innerHTML = players
    var x = document.getElementsByClassName("delete_player")
    for (var i = 0; i < x.length; i++) {
        x[i].addEventListener('click', delete_player, false)
    }
  });
}

function add_competition()
{
  var competition = document.getElementById('input_competition').value
  if(competition.length > 0)
  {
    db.insert({ competition: competition}, function (err, newDocs) {
    });
    see_competition()
    alert("competition added")
  }
}

function delete_competition()
{
  var id = this.getAttribute("id")

  db.remove({ _id: id }, { multi: true }, function (err, numRemoved) {
  });
  see_competition()
  alert("competition deleted")
}

function add_player(evt)
{
    var input_player = document.getElementById('input_player').value
    var input_team = document.getElementById('input_team').value
    evt.preventDefault();
    db.insert({ team: input_team, player : input_player}, function (err, newDocs) {
    });
    see_player()
    alert("player added")
}

function delete_player()
{
  var id = this.getAttribute("id")
  db.remove({ _id: id }, { multi: true }, function (err, numRemoved) {
  });
  see_player()
  alert("player deleted")
}

document.getElementById("add_competition").addEventListener("click", add_competition)
document.getElementById("add_player").addEventListener("click", add_player)
see_competition()
see_player()
