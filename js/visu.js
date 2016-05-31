var canvas = document.getElementById('map_canvas'),
context = canvas.getContext('2d');
var Datastore = require('nedb')
, db = new Datastore({ filename: './database/db.json', autoload: true });

var global_start_timer = new Date()
global_start_timer.setSeconds(0)
global_start_timer.setMinutes(0)
global_start_timer.setFullYear(2000, 0, 0)
global_start_timer.setHours(0)
var global_end_timer = new Date()
global_end_timer.setSeconds(0)
global_end_timer.setMinutes(0)
global_end_timer.setFullYear(2000, 0, 0)
global_end_timer.setHours(0)

function map()
{
  map = new Image();
  map.src = '../img/map.jpg'
  map.onload = function(){
	context.drawImage(map, 0, 0, map.width, map.height,
		 0, 0, canvas.width, canvas.height)
  }
}

function load(evt)
{
    evt.preventDefault()
    context.clearRect(0,0,canvas.width, canvas.height)
    context.drawImage(map, 0, 0, map.width, map.height,
     0, 0, canvas.width, canvas.height)

     var team = localStorage.getItem('team')
     var side = localStorage.getItem('side')
     var opponant = localStorage.getItem('opponant')
     var competition = localStorage.getItem('competition')
     var game = localStorage.getItem('game')
     var player_select = document.getElementById('players')
     var player =player_select.options[player_select.selectedIndex].value
     var ward_select = document.getElementById('wards')
     var ward =ward_select.options[ward_select.selectedIndex].value
     var type_visu = document.getElementById('type_visu')
     var visu =type_visu.options[type_visu.selectedIndex].value
     var start_timer= convertToDate(document.getElementById('start_timer').value)
     start_timer = new Date(start_timer).getTime()
     var end_timer = convertToDate(document.getElementById('end_timer').value)
     end_timer = new Date(end_timer).getTime()

     if(opponant =="All")
     {
        opponant = new RegExp(".*")
     }
     if(competition =="All")
     {
        competition = new RegExp(".*")
     }
     if(game =="All")
     {
       game = new RegExp(".*")
     }
     if(ward =="All")
     {
       ward = new RegExp(".*")
     }
     if(player =="All")
     {
       player = new RegExp(".*")
     }

    db.find({team_ward:team,side:side,competition_ward:competition,game:game,opponant:opponant,
      player_ward:player,ward:ward},
       function (err, docs)
    {
      start_timer= new Date (start_timer).getTime()
      end_timer= new Date (end_timer).getTime()
      for(var i = 0 ; i < docs.length;i++)
      {
        var temp_timer= new Date(docs[i].timer)
        var temp_death_timer= new Date(docs[i].death_timer)
        if(visu=="heatmap")
        {
          if((temp_timer.getTime() < end_timer) &
          (temp_death_timer.getTime() >=start_timer ))
          {
              var grd=context.createRadialGradient(docs[i].x,docs[i].y,5,docs[i].x,docs[i].y,22)
              grd.addColorStop(0,'rgba(255, 0, 0,0.7)')
              grd.addColorStop(1,'rgba(255, 204, 50,0.2)')
              context.beginPath()
              context.fillStyle = grd
              context.arc(docs[i].x ,docs[i].y,22,0,2*Math.PI)
              context.fill()
              context.closePath()
            }
        }
        if(visu=="points")
        {
          if((temp_timer.getTime() < end_timer) &
          (temp_death_timer.getTime() >=start_timer ))
          {
          var color = fillcolor(docs[i].ward)
          context.beginPath()
          context.rect(docs[i].x,docs[i].y,8,8)
          context.fillStyle= color
          context.fill()
          }
        }
      }
    });
}

function fillcolor(str)
{
  if(str=="trincket")
  {
    return 'yellow'
  }
  else if(str=="pink_ward")
  {
    return 'rgba(255, 0, 102,1)'
  }
  else if(str=="tracker_Knife")
  {
    return 'rgba(34, 139, 34,1)'
  }
  else if(str=="sightstone")
  {
    return 'rgba(250, 250, 250,1)'
  }
  else if (str=="blue_Tincket") {
    return 'blue'
  }
}
function fillplayer(){
  var player_list_by_team = localStorage.getItem('team')

  db.find({team_ward : player_list_by_team}, function (err, docs) {
    var result =[];
    for(var i = 0 ; i < docs.length ; i++)
    {
      result.push(docs[i].player_ward);
    }

    result = result.filter(function(elem, index, self) {
        return index == self.indexOf(elem);
    })

    var players= "<option value=\"All\">All</option>";
    for(var i = 0 ; i < result.length ; i++)
    {

      players = players +'<option value=\''+result[i]+'\'>'+result[i]+'</option>';
      document.getElementById('players').innerHTML = players;
    }
  });
}

function animation_plus()
{
  global_start_timer = new Date(global_start_timer)
  global_end_timer = new Date(global_start_timer)
  global_start_timer = global_start_timer.setSeconds((global_start_timer.getSeconds()+10))
  global_end_timer = global_end_timer.setSeconds((global_end_timer.getSeconds()+11))
  animate()
}

function animation_minus()
{
  global_start_timer = new Date(global_start_timer)
  global_end_timer = new Date(global_start_timer)
  global_start_timer = global_start_timer.setSeconds((global_start_timer.getSeconds()-10))
  global_end_timer = global_end_timer.setSeconds((global_end_timer.getSeconds()-9))
  animate()
}

function animation_launch()
{
  id_interval = setInterval(function(){
     animate();
     global_start_timer = new Date(global_start_timer)
     global_end_timer = new Date(global_start_timer)
     global_start_timer = global_start_timer.setSeconds((global_start_timer.getSeconds()+1))
     global_end_timer = global_end_timer.setSeconds((global_end_timer.getSeconds()+2))
   }, 0100);
}

function animation_stop()
{
  clearInterval (id_interval)
}

function animate()
{
  context.clearRect(0,0,canvas.width, canvas.height);
  context.drawImage(map, 0, 0, map.width, map.height,
   0, 0, canvas.width, canvas.height);

   var team = localStorage.getItem('team');
   var side = localStorage.getItem('side');
   var opponant = localStorage.getItem('opponant');
   var competition = localStorage.getItem('competition');
   var game = localStorage.getItem('game');
   var player_select = document.getElementById('players');
   var player =player_select.options[player_select.selectedIndex].value;
   var ward_select = document.getElementById('wards');
   var ward =ward_select.options[ward_select.selectedIndex].value;
   var type_visu = document.getElementById('type_visu');
   var visu =type_visu.options[type_visu.selectedIndex].value;

   if(opponant =="All")
   {
      opponant = new RegExp(".*");
   }
   if(competition =="All")
   {
      competition = new RegExp(".*");
   }
   if(game =="All")
   {
     game = new RegExp(".*");
   }
   if(ward =="All")
   {
     ward = new RegExp(".*");
   }
   if(player =="All")
   {
     player = new RegExp(".*");
   }
   document.getElementById('time_animation').innerHTML =
   "<p> Time :"+ getTimeAsStr(global_start_timer)+"</p>";

  db.find({team_ward:team,side:side,competition_ward:competition,game:game,opponant:opponant,
    player_ward:player,ward:ward}, function (err, docs)
  {
    for(var i = 0 ; i < docs.length;i++)
    {
      var global_start_timer_str= String(global_start_timer)
      var global_end_timer_str= String(global_end_timer)
      var temp_timer= new Date(docs[i].timer)
      var temp_death_timer= new Date(docs[i].death_timer)
      if(visu=="heatmap")
      {
        if((temp_timer.getTime() < global_end_timer_str) &
        (temp_death_timer.getTime() >= global_start_timer_str))
        {
          var grd=context.createRadialGradient(docs[i].x,docs[i].y,5,docs[i].x,docs[i].y,22);
          grd.addColorStop(0,'rgba(255, 0, 0,0.8)');
          grd.addColorStop(1,'rgba(255, 204, 50,0.2)');
          context.beginPath();
          context.fillStyle = grd;
          context.arc(docs[i].x ,docs[i].y,22,0,2*Math.PI);
          context.fill();
          context.closePath();
        }
      }
      if(visu=="points")
      {
        if((temp_timer.getTime() < global_end_timer_str) &
        (temp_death_timer.getTime() >= global_start_timer_str))
        {
          var color = fillcolor(docs[i].ward)
          context.beginPath();
          context.rect(docs[i].x,docs[i].y,8,8);
          context.fillStyle= color;
          context.fill();
        }
      }
    }

  });
}

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
    return false
  }
  else {
    var min = parseInt(str.substring(0,2))
    var sec = parseInt(str.substring(3,5))
    if(str.substring(2,3)!=":")
    {
      return false
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

var title ="<tr class=\"center aligned\"><td>"+localStorage.getItem('competition')+ "</td><td>"+
localStorage.getItem('team')+ "</td><td>"+localStorage.getItem('side')+ "</td><td>"+
localStorage.getItem('opponant')+ "</td><td>"+localStorage.getItem('game')+
 "</tr>";
document.getElementById('title').innerHTML =title;

map()
fillplayer()
document.getElementById('visualize').addEventListener('click', load);
document.getElementById('play').addEventListener('click', animation_launch);
document.getElementById('plus').addEventListener('click', animation_plus);
document.getElementById('minus').addEventListener('click', animation_minus);
document.getElementById('stop').addEventListener('click', animation_stop);
