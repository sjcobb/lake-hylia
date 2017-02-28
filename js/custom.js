/*
 *** CUSTOM JS ***
*/

function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if(pair[0] == variable){return pair[1];}
  }
  return(false);
}

//console.log(getQueryVariable("id"));
//console.log(getQueryVariable("hasKey"));

function foo(data)
{
    // do stuff with JSON
}

//var script = document.createElement('script');
//script.src = '//example.com/path/to/jsonp?callback=foo'
//script.src = '//lost-woods.com/js/inventory.js'


//document.head.appendChild(script);