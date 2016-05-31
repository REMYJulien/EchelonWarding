var Datastore = require('nedb')
, db = new Datastore({ filename: './database/db.json', autoload: true });

//fill select team and opponant options
function fillTeamOpponant(){
  db.find({team : /.*/}).sort({ team: 1 }).exec(function (err, docs) {
    var result =[];

    for(var i = 0 ; i < docs.length ; i++)
    {
      result.push(docs[i].team);
    }

    result = result.filter(function(elem, index, self) {
        return index == self.indexOf(elem);
    })

    var options= "<option  value=\"\" selected disabled>Team</option>"

    for(var i = 0 ; i < result.length ; i++)
    {
      options = options +'<option value=\''+result[i]+'\'>'+result[i]+'</option> + \n';
      document.getElementById('team').innerHTML = options;
      document.getElementById('opponant').innerHTML = options;
    }
  });
}

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

function fillCompetition(){
  db.find({competition : /.*/}).sort({ competition: 1 }).exec(function (err, docs) {
    var result =[];
    for(var i = 0 ; i < docs.length ; i++)
    {
      result.push(docs[i].competition);
    }

    result = result.filter(function(elem, index, self) {
        return index == self.indexOf(elem);
    })

    var options= "<option  value=\"\" selected disabled>Competition</option>";;

    for(var i = 0 ; i < result.length ; i++)
    {
      options= options +'<option value=\''+result[i]+'\'>'+result[i]+'</option> + \n';
      document.getElementById('competition').innerHTML = options;
    }
  });
}


function load(evt)
{
  var side_select = document.getElementById('side');
  var side =side_select.options[side_select.selectedIndex].value;

  var team_select = document.getElementById('team');
  var team =team_select.options[team_select.selectedIndex].value;

  var opponant_select = document.getElementById('opponant');
  var opponant =opponant_select.options[opponant_select.selectedIndex].value;

  var competition_select = document.getElementById('competition');
  var competition =competition_select.options[competition_select.selectedIndex].value;

  var game = document.getElementById('game').value;

  if (side == "") {
    alert("Please you have to select a side")
  }
  else if (team == "") {
    alert("Please you have to select a team")
  }
  else if (opponant == "") {
    alert("Please you have to select an opponant team")
  }
  else if (competition == "") {
    alert("Please you have to select a competition")
  }
  else {
    evt.preventDefault();
    localStorage.setItem('side', side);
    localStorage.setItem('team', team);
    localStorage.setItem('opponant', opponant);
    localStorage.setItem('game',game);
    localStorage.setItem('competition',competition);
    window.location.href = "injector.html"
  }
}

//semantic option for list dropdown
function activeDropdown(){
  $('#competition')
    .dropdown({placeholder:'competition'}
    )
  ;
  $('#team')
    .dropdown({placeholder:'team'}
    )
  ;
  $('#opponant')
    .dropdown({placeholder:'opponant'}
    )
  ;
  $('#side')
    .dropdown({placeholder:'Side'}
    )
  ;
}

//main
fillTeamOpponant()
fillCompetition()
activeDropdown()
displayCompet()

document.getElementById('button').addEventListener('click', load);
