//bdd part
var Datastore = require('nedb')
, db = new Datastore({ filename: './database/db.json', autoload: true });

var canvas = document.getElementById('map_canvas'),
context = canvas.getContext('2d');

var form = document.getElementById('param_form');
canvas.addEventListener('click', click, false);
var x =-1
var y =-1
var ward = ''
var player = ''
var timer =new Date()
var death_timer = new Date()
var team = localStorage.getItem('team');
var side = localStorage.getItem('side');
var opponant = localStorage.getItem('opponant');
var competition = localStorage.getItem('competition');
var game = localStorage.getItem('game');
var form = document.getElementById('form_new_match');

var title ="<tr class=\"center aligned\"><td>"+competition+ "</td><td>"+
            team+ "</td><td>"+side+ "</td><td>"+opponant+ "</td><td>"+game+"</tr>";

document.getElementById('title').innerHTML =title;

function click(evt) {
	context.clearRect(0,0,canvas.width, canvas.height);
	context.drawImage(map, 0, 0, map.width, map.height,
		 0, 0, canvas.width, canvas.height);

	x = evt.pageX- this.offsetLeft ;
 	y = evt.pageY- this.offsetTop ;
	context.beginPath();
	context.arc(x,y,3,0,2*Math.PI);
	context.fillStyle = 'red';
  context.fill();
  context.beginPath();
  context.arc(x,y,22,0,2*Math.PI);
  context.strokeStyle = 'red'
  context.stroke()
}

function map()
{
  map = new Image();
  map.src = '../img/map.jpg';
  map.onload = function(){
	context.drawImage(map, 0, 0, map.width, map.height,
		 0, 0, canvas.width, canvas.height);
  }
}

function see_ward()
{
  var wards_list = "";
  db.find({team_ward:team,side:side,opponant:opponant,competition_ward:competition,game:game,timer:/.*/})
    .sort({ timer: -1 }).exec(
    function (err, docs) {
    for (var i = 0; i < docs.length; i++) {
      var timer_as_date = new Date(docs[i].timer)
      var deathtimer_as_date = new Date(docs[i].death_timer)
      wards_list = wards_list + "<tr class=\"center aligned\"><td>"+docs[i].ward+"</td><td>"+docs[i].player_ward
      +"</td><td>"+getTimeAsStr(timer_as_date)+"</td><td class=\"td_ward\" contenteditable=\"true\" id=\""
      +docs[i]._id+'1dt'+"\">"+getTimeAsStr(deathtimer_as_date) +
      "</td><td>"+"<button type=\"button\" class=\"delete_ward ui inverted orange button \" id=\""+
      docs[i]._id+"\">Delete</button>"+
      "</td><td>"+"<button type=\"button\" class=\"update_ward ui inverted orange button\" id=\""+
      docs[i]._id+'1'+"\">SAVE</button>" +"</td></tr>";
    }
    document.getElementById('list_ward').innerHTML = wards_list;

    var delete_ward_list = document.getElementsByClassName("delete_ward");
    for (var i = 0; i < delete_ward_list.length; i++) {
        delete_ward_list[i].addEventListener('click', delete_ward, false);
    }

    var update_ward_list = document.getElementsByClassName("update_ward");
    for (var i = 0; i < update_ward_list.length; i++) {
        update_ward_list[i].addEventListener('click', update, false);
    }
  });
}


document.getElementById('submit_button').addEventListener('click', function () {
	var ward_select = document.getElementById('ward')
	var player_select = document.getElementById('players')
	ward =ward_select.options[ward_select.selectedIndex].value
	player = player_select.options[player_select.selectedIndex].value
	timer = String(convertToDate(document.getElementById('timer').value))
  death_timer = String(convertToDate(document.getElementById('death_timer').value))
  context.clearRect(0,0,canvas.width, canvas.height);
	context.drawImage(map, 0, 0, map.width, map.height,
		 0, 0, canvas.width, canvas.height);
	 if (x > 0 & y > 0)
	 {
		 db.insert([{competition_ward : competition, game: game, side : side, team_ward : team,
			  opponant : opponant, player_ward : player, timer : timer, death_timer : death_timer,
         ward : ward, x : x, y : y}], function (err, newDocs) {
		 });
		 x = -1;
		 y = -1;
     alert("ward added")
	 }
   see_ward();
},false);

function convertToDate(str)
{
  date = new Date();
  if(isTimeFormat(str))
  {
    var min = parseInt(str.substring(0,2))
    var sec = parseInt(str.substring(3,5))
    date.setFullYear(2000, 0, 0);
    date.setHours(0);
    date.setMinutes(min)
    date.setSeconds(sec)
    return date
  }
  return date
}

function getTimeAsStr(date)
{
  var temp = new Date(date)
  var min = (temp.getMinutes()<10?'0':'') + temp.getMinutes()
  var sec = (temp.getSeconds()<10?'0':'') + temp.getSeconds()
  return min+":"+sec
}

function isTimeFormat(str)
{
  str = String(str)
  if(str.length != 5)
  {
    return false;
  }
  else {
    var min = parseInt(str.substring(0,2))
    var sec = parseInt(str.substring(3,5))
    if(str.substring(2,3)!=":")
    {
      return false;
    }
    if(min>=99 | min < 0)
    {
      return false
    }
    if(sec>60 | sec < 0)
    {
      return false
    }
  }
  return true
}

function delete_ward()
{
  var id = this.getAttribute("id");
  db.remove({ _id: id }, { multi: true }, function (err, numRemoved) {
  });
  alert("ward deleted")
  see_ward();
}

function fillPlayer()
{
  db.find({team:team,player:/.*/}, function (err, docs) {
    var result =[];
    for(var i = 0 ; i < docs.length ; i++)
    {
      result.push(docs[i].player);
    }

    result = result.filter(function(elem, index, self) {
        return index == self.indexOf(elem);
    })

    var players= "";
    for(var i = 0 ; i < result.length ; i++)
    {
      players = players +'<option value=\''+result[i]+'\'>'+result[i]+'</option> \n';
      document.getElementById('players').innerHTML = players;
    }
  });
}

function update()
{
  var fake_id = this.getAttribute("id")
  var id = fake_id.substring(0, fake_id.length - 1);
  var id_td = fake_id+'dt'
  var new_value = new Date (convertToDate(document.getElementById(id_td).innerHTML));
  db.update({ _id : id }, { $set: { death_timer: new_value} }, { multi: true }, function (err, numReplaced) {
  });
  alert("ward updated")
}

function activeDropdown(){
  $('#players')
    .dropdown({placeholder:'Player'}
    )
  ;
  $('#ward')
    .dropdown({placeholder:'Ward'}
    )
  ;
}

see_ward()
activeDropdown()
fillPlayer()
map()
