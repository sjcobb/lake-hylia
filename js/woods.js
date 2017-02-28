
function checkWoods(object) {
  //console.log(object);
  //console.log(camera.position);
  if (camera.position.z > 12) { //bottom
    if (hasKey == true) {
      //window.location = "https://sjcobb.github.io/fire-temple/?hasKey=true";
      window.location = "http://lost-woods.com/?hasKey=true";
    } else {
      window.location = "http://lost-woods.com";
    }
  }
  if (camera.position.x < -12) { //left
    
  }
  if (camera.position.x > 12) { //right
    
  }
  if (camera.position.z < -8) { //top
    if (hasKey == false) {
      //scene.remove(keyMesh);
      //updateInventory();
    }
  }
  if (camera.position.z < -12 || camera.position.z > 12 || camera.position.x > 12 || camera.position.x < -12) {
    //object.resetHero = true;
  }

}