var Datastore = require('nedb')
, db = new Datastore({ filename: './database/db.json', autoload: true });

const fs = require('fs');

function displayCompet()
{
  db.find({team_ward:/.*/}, function (err, docs) {
  var matches = [];
  for (var i = 0; i < docs.length; i++)
  {
    if(docs[i].game != "")
    {
      var one_match = docs[i].competition_ward +" - "+docs[i].team_ward +  " - "+docs[i].side
      +  " - "+docs[i].opponant + " - "+docs[i].game;
    }
    else {
      var one_match = docs[i].competition_ward +  " - "+docs[i].team_ward +  " - "+docs[i].side
      +  " - "+docs[i].opponant +  " - Game unknown";
    }
    if(one_match!="undefined" && one_match!="")
    {
        matches.push(one_match);
    }
  }

  matches = matches.filter(function(elem, index, self) {
      return index == self.indexOf(elem);
  });
  
  var matches_table = "";
  for(var i = 0 ; i < matches.length ; i++)
  {
    matches_table= matches_table +" <div class=\"ui orange segment\"><p>"
    +matches[i]+"</p></div>";
    document.getElementById('all_matches').innerHTML = matches_table;
  }
  });
}

function replaceByRegexAll(str1,str2)
{
  if(str1 == str2){
      return new RegExp(".*")
  }
  else{
    return str1
  }
}

function export_fct()
{
       var game_select = document.getElementById('game');
       var game =game_select.options[game_select.selectedIndex].value;
       var competition_select = document.getElementById('competition');
       var competition =competition_select.options[competition_select.selectedIndex].value;
       var team_select = document.getElementById('team');
       var team =team_select.options[team_select.selectedIndex].value;
       var side_select = document.getElementById('side');
       var side =side_select.options[side_select.selectedIndex].value;
       var opponant_select = document.getElementById('opponant');
       var opponant =opponant_select.options[opponant_select.selectedIndex].value;

       opponant = replaceByRegexAll(opponant,"All")
       competition = replaceByRegexAll(competition,"All")
       game = replaceByRegexAll(game,"All")


      db.find({team_ward:team,side:side,competition_ward:competition,game:game,opponant:opponant},
         function (err, docs)
      {
        var content=''
        for (var i = 0; i < docs.length; i++)
        {
          content  = content + "{\"competition\":\""+docs[i].competition_ward+"\","+
                              "\"game\":\""+docs[i].game+"\","+
                              "\"side\":\""+docs[i].side+"\","+
                              "\"team\":\""+docs[i].team_ward+"\","+
                              "\"opponant\":\""+docs[i].opponant+"\","+
                              "\"player\":\""+docs[i].player_ward+"\","+
                              "\"timer\":\""+docs[i].timer+"\","+
                              "\"death_timer\":\""+docs[i].death_timer+"\","+
                              "\"ward\":\""+docs[i].ward+"\","+
                              "\"x\":\""+docs[i].x+"\","+
                              "\"y\":\""+docs[i].y+"\","+
                              "\"_id\":\""+docs[i]._id+"\"}\n"
        }

        fs.writeFile('data.json', content, (err) => {
        if (err) throw err;
        alert("File is ready.")
      });

      })
}

function fillSelect()
{
  db.find({team_ward:/.*/}, function (err, docs) {

    var team =[];
    var game =[];
    var competition =[];
    var opponant = []

    for(var i = 0 ; i < docs.length ; i++)
    {
        team.push(docs[i].team_ward);
    }
    for(var i = 0 ; i < docs.length ; i++)
    {
      game.push(docs[i].game);
    }
    for(var i = 0 ; i < docs.length ; i++)
    {
      competition.push(docs[i].competition_ward);
    }
    for(var i = 0 ; i < docs.length ; i++)
    {
      opponant.push(docs[i].opponant);
    }

    team = team.filter(function(elem, index, self) {
        return index == self.indexOf(elem);
    })
    game = game.filter(function(elem, index, self) {
        return index == self.indexOf(elem);
    })
    competition = competition.filter(function(elem, index, self) {
        return index == self.indexOf(elem);
    })
    opponant = opponant.filter(function(elem, index, self) {
        return index == self.indexOf(elem);
    })

    var team_options ='<option value=\'unknow\'>Team</option> + \n'
    var opponant_options ='<option value=\'All\'>All</option> + \n'
    var game_options ='<option value=\'All\'>All</option> + \n'
    var competition_options ='<option value=\'All\'>All</option> + \n'

    for(var i = 0 ; i < team.length ; i++)
    {
      team_options= team_options +'<option value=\''+team[i]+'\'>'+team[i]+'</option> + \n';
      document.getElementById('team').innerHTML = team_options;
    }

    for(var i = 0 ; i < opponant.length ; i++)
    {
    opponant_options = opponant_options +'<option value=\''+opponant[i]+'\'>'+opponant[i]+'</option> + \n';
      document.getElementById('opponant').innerHTML = opponant_options;
    }

    for(var i = 0 ; i < game.length ; i++)
    {
      if(game[i] != "")
      {
        game_options= game_options +'<option value=\''+game[i]+'\'>'+game[i]+'</option> + \n';
        document.getElementById('game').innerHTML = game_options;
      }
    }

    for(var i = 0 ; i < competition.length ; i++)
    {
      competition_options = competition_options +'<option value=\''+competition[i]+'\'>'+competition[i]+'</option> + \n';
      document.getElementById('competition').innerHTML = competition_options;
    }
  });
}

function go(evt){

  var side_select = document.getElementById('side');
  var side =side_select.options[side_select.selectedIndex].value;

  var team_select = document.getElementById('team');
  var team =team_select.options[team_select.selectedIndex].value;

  var opponant_select = document.getElementById('opponant');
  var opponant =opponant_select.options[opponant_select.selectedIndex].value;

  var competition_select = document.getElementById('competition');
  var competition =competition_select.options[competition_select.selectedIndex].value;

  var game_select = document.getElementById('game');
  var game =game_select.options[game_select.selectedIndex].value;

  if (side == "unknow") {
    alert("Please you have to select a side")
  }
  else if (team == "unknow") {
    alert("Please you have to select a team")
  }
  else {
    evt.preventDefault();
    localStorage.setItem('side', side);
    localStorage.setItem('team', team);
    localStorage.setItem('opponant', opponant);
    localStorage.setItem('game',game);
    localStorage.setItem('competition',competition);
    window.location = 'visualization.html'
  }
}

function activeDropdown(){
  $('#game')
    .dropdown(
    )
  ;
  $('#team')
    .dropdown({placeholder:'Team'}
    )
  ;
  $('#opponant')
    .dropdown(
    )
  ;
  $('#competition')
    .dropdown(
    )
  ;
  $('#side')
    .dropdown()
  ;
}

displayCompet()
fillSelect()
activeDropdown()

document.getElementById('button').addEventListener('click', go)
