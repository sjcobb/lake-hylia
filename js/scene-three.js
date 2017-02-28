/*
 *** SCENE JS ***
*/

// Apply VR stereo rendering to renderer.
var effect = new THREE.VREffect(renderer);
effect.setSize(window.innerWidth, window.innerHeight);


var vrDisplay;
function setupStage() {
  navigator.getVRDisplays().then(function(displays) {
    if (displays.length > 0) {
      vrDisplay = displays[0];
      if (vrDisplay.stageParameters) {
        setStageDimensions(vrDisplay.stageParameters);
      }
      vrDisplay.requestAnimationFrame(animate);
      //vrDisplay.requestAnimationFrame(render);
    }
  });
}

// Create a VR manager helper to enter and exit VR mode.
var params = {
  hideButton: false, // Default: false.
  isUndistorted: false // Default: false.
};
var manager = new WebVRManager(renderer, effect, params);


/* Example Scene Start */
// player motion parameters
var motion = {
  airborne : false,
  position : new THREE.Vector3(), velocity : new THREE.Vector3(),
  rotation : new THREE.Vector2(), spinning : new THREE.Vector2()
};

motion.position.y = -150;
console.log(motion);

var updateCamera = (function() {
  var euler = new THREE.Euler( 0, 0, 0, 'YXZ' );

  return function() {
    euler.x = motion.rotation.x;
    euler.y = motion.rotation.y;
    camera.quaternion.setFromEuler( euler );

    camera.position.copy( motion.position );

    camera.position.y += 3.0;
  };
})();


// init 3D stuff

function makeSkybox( urls, size ) {
  var skyboxCubemap = new THREE.CubeTextureLoader().load( urls );
  skyboxCubemap.format = THREE.RGBFormat;

  var skyboxShader = THREE.ShaderLib['cube'];
  skyboxShader.uniforms['tCube'].value = skyboxCubemap;

  return new THREE.Mesh(
    new THREE.BoxGeometry( size, size, size ),
    new THREE.ShaderMaterial({
      fragmentShader : skyboxShader.fragmentShader, vertexShader : skyboxShader.vertexShader,
      uniforms : skyboxShader.uniforms, depthWrite : false, side : THREE.BackSide
    })
  );
}

function makePlatform( jsonUrl, textureUrl, textureQuality ) {
  var placeholder = new THREE.Object3D();

  var texture = new THREE.TextureLoader().load( textureUrl );
  texture.minFilter = THREE.LinearFilter;
  texture.anisotropy = textureQuality;

  var loader = new THREE.JSONLoader();
  loader.load( jsonUrl, function( geometry ) {

    geometry.computeFaceNormals();

    var platform = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial({ map : texture }) );

    platform.name = "platform";

    placeholder.add( platform );
  });

  return placeholder;
}

var renderer = new THREE.WebGLRenderer({ antialias : true });
renderer.setPixelRatio( window.devicePixelRatio );

//var camera = new THREE.PerspectiveCamera( 60, 1, 0.1, 9000 );
var camera = new THREE.PerspectiveCamera( 60, 1, 0.1, 9000 );
//var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);

var scene = new THREE.Scene();

scene.add( camera );

var vrControls = new THREE.VRControls(camera);
var fpVrControls = new THREE.FirstPersonVRControls(camera, scene);
fpVrControls.verticalMovement = true;
fpVrControls.movementSpeed = 10;
vrControls.standing = true;

scene.add( makeSkybox( [
  'assets/textures/skybox/px.jpg', // right
  'assets/textures/skybox/nx.jpg', // left
  'assets/textures/skybox/py.jpg', // top
  'assets/textures/skybox/ny.jpg', // bottom
  'assets/textures/skybox/pz.jpg', // back
  'assets/textures/skybox/nz.jpg'  // front
], 8000 ));

scene.add( makePlatform(
  'assets/models/platform/platform.json',
  'assets/models/platform/platform.jpg',
  renderer.getMaxAnisotropy()
));

///////////
// FLAME //
///////////
scene.add( fire.mesh );
fire.mesh.position.set( 0, fireHeight / 2, 0 );

setupStage();

// start the game
var start = function( gameLoop, gameViewportSize ) {
  var resize = function() {
    var viewport = gameViewportSize();
    renderer.setSize( viewport.width, viewport.height );
    camera.aspect = viewport.width / viewport.height;
    camera.updateProjectionMatrix();
  };

  window.addEventListener( 'resize', resize, false );
  resize();

  var lastTimeStamp;
  var render = function( timeStamp ) {
    var timeElapsed = lastTimeStamp ? timeStamp - lastTimeStamp : 0; lastTimeStamp = timeStamp;

    // call our game loop with the time elapsed since last rendering, in ms
    gameLoop( timeElapsed );

    vrControls.update();
    fpVrControls.update(timeStamp);

    renderer.render( scene, camera );
    requestAnimationFrame( render );

    //vrDisplay.requestAnimationFrame(render);
  };

  requestAnimationFrame( render );
};

var gameLoop = function( dt ) {
  resetPlayer();
  //keyboardControls();
  jumpPads();
  applyPhysics( dt );
  updateCamera();

  //vrControls.update();
  //fpVrControls.update(dt);
};

var gameViewportSize = function() { return {
  width: window.innerWidth, height: window.innerHeight
}};

document.getElementById( 'container' ).appendChild( renderer.domElement );

start( gameLoop, gameViewportSize );
