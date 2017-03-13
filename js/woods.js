/*
 *** WOODS JS ***
*/

function checkWoods(object) {
  if (camera.position.z > 12) { //bottom
    if (hasKey == true) {
      //window.location = "http://lost-woods.com/?hasKey=true";
    } else {
      //window.location = "http://lost-woods.com";
    }
  }
  if (camera.position.x < -12) { //left
    
  }
  if (camera.position.x > 12) { //right
    
  }
  if (camera.position.z < -8) { //top
    
  }


}