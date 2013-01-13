var ctx = $('#canvas')[0].getContext("2d");
var canvas = document.getElementById('canvas');
var lines = 0
var log = [];

/**/
console.log = function (s){
  lines++;
  log.push(s)
  setTimeout(function(){
    log.splice(0,1);
  },5000);
}
/**/

var need = function(url, fun) {
  jQuery.get(url,fun,'text');
}

var toType = function(obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}


function dispLog(){
  ctx.fillStyle = 'grey';
  ctx.font = '10px Arial';
  for (var i = 0; i < log.length; i++) {
    ctx.fillText(log[i], 20, 30+12*i);
  };
}

var tempLoop = setInterval(function(){
  ctx.fillStyle = '#131313';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  dispLog();
},50);

var socket = io.connect('http://localhost');
socket.on('ping',function(){
  //console.log('Caught ping!')
  socket.emit('pong');
});

need('modules/gamestate.js',function(data){
  eval(data);
  need('modules/loader.js',function(d){
    eval(d);
    clearInterval(tempLoop);
    setInterval(function(){
      gs.update();
    },(1000/60))
    main = false;
    loader.require('modules/input.js');
    loader.require('app/main.js');
    gs.switchstate(loader.state);
  })
},'script');