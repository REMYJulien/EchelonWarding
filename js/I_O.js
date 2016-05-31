var Datastore = require('nedb')
, db = new Datastore({ filename: './database/db.json', autoload: true });
const fs = require('fs');

function readBlob() {
   var files = document.getElementById('files').files;
   if (!files.length) {
     alert('Please select a file!');
     return;
   }

   var file = files[0];
   var start = 0;
   var stop = file.size - 1;
   var reader = new FileReader();

   reader.onloadend = function(evt) {
     if (evt.target.readyState == FileReader.DONE) {
       var data = evt.target.result
       fs.appendFile('./database/db.json', data, (err) => {
         if (err) throw err;
         alert("Imported !")
        });
       }
   };
   var blob = file.slice(start, stop + 1);
   reader.readAsBinaryString(blob);
}

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

    var options= "<option  value=\"\" selected disabled>Team</option>";
    for(var i = 0 ; i < result.length ; i++)
    {
      options = options +'<option value=\''+result[i]+'\'>'+result[i]+'</option> + \n';
      document.getElementById('team').innerHTML = options;
    }
  });
}


function activeDropdown(){
  $('#competition')
    .dropdown(
    )
  ;
  $('#team')
    .dropdown(
    )
  ;
  $('#opponant')
    .dropdown(
    )
  ;
}

function fillSelect()
{
  db.find({team_ward:/.*/}, function (err, docs) {

    var team =[];
    var competition =[];
    for(var i = 0 ; i < docs.length ; i++)
    {
        team.push(docs[i].team_ward);
    }

    for(var i = 0 ; i < docs.length ; i++)
    {
      competition.push(docs[i].competition_ward);
    }


    team = team.filter(function(elem, index, self) {
        return index == self.indexOf(elem);
    })

    competition = competition.filter(function(elem, index, self) {
        return index == self.indexOf(elem);
    })

    var competition_options ='<option value=\'All\'>All</option> + \n'
    var team_options ='<option value=\'All\'>All</option> + \n'

    for(var i = 0 ; i < team.length ; i++)
    {
      team_options = team_options +'<option value=\''+team[i]+'\'>'+team[i]+'</option> + \n';
      document.getElementById('team').innerHTML = team_options;
    }
    for(var i = 0 ; i < competition.length ; i++)
    {
      competition_options = competition_options +'<option value=\''+competition[i]+'\'>'+competition[i]+'</option> + \n';
      document.getElementById('competition').innerHTML = competition_options;
    }
  });
}

fillSelect()
activeDropdown()

 document.getElementById("import_button").addEventListener('click', readBlob);

 document.getElementById("export_button").addEventListener('click', function writeBlob(evt) {
    evt.preventDefault();
    var filename = "../../"+document.getElementById("filename").value
    var game = document.getElementById("game").value
    var competition_select = document.getElementById('competition');
    var competition =competition_select.options[competition_select.selectedIndex].value;
    var team_select = document.getElementById('team');
    var team =team_select.options[team_select.selectedIndex].value;

    if (game == "") {
       game = new RegExp(".*");
    }

    db.find({team_ward:team,competition_ward:competition,game:game}, function (err, docs) {
      var content=""
      for(var i = 0 ; i < docs.length ; i++)
      {
        content = content + "{\"competition_ward\":\""+docs[i].competition_ward+"\",\"game\":\""
        +docs[i].game+"\",\"side\":\"" + docs[i].side +"\",\"team_ward\":\"" + docs[i].team_ward+ "\",\"opponant\":\""+
        docs[i].opponant+"\",\"player_ward\":\""+docs[i].player_ward+"\",\"timer\":\""+
        docs[i].timer+"\",\"death_timer\":\""+docs[i].death_timer+"\",\"ward\":\""+docs[i].ward
        +"\",\"x\":\""+docs[i].x+"\",\"y\":\""+docs[i].y+"\",\"_id\":\""+docs[i]._id +"\"}\n"
      }
      fs.writeFile(filename, content, (err) => {
        if (err) throw err;
        alert(content)
        alert("Exported !")
      });
    });
  },false);
