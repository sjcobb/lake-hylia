/*
 *** CUSTOM JS ***
*/

var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setPixelRatio(window.devicePixelRatio);

document.body.appendChild(renderer.domElement);

var clock = new THREE.Clock();
var scene = new THREE.Scene();

var origin, navi;
var direction = new THREE.Vector3(0, 0, 1);
var direction_navi = new THREE.Vector3(0, 0, 1);
var speed = 100; // units per second
var navi_speed = 50;
var clock = new THREE.Clock();
var delta, shift = new THREE.Vector3(), shift_navi = new THREE.Vector3();
var epsilon = speed / 60;

var objects = [];
var sun; 

/*** CAMERA ***/
//var camera = new THREE.PerspectiveCamera(1000, window.innerWidth / window.innerHeight, 0.1, 10000); //upside down
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);

/*** VR Controls ***/
var vrControls = new THREE.VRControls(camera); // js/lib/VRControls.js
vrControls.standing = true; //does nothing
var fpVrControls = new THREE.FirstPersonVRControls(camera, scene); //vr-controls.js
fpVrControls.verticalMovement = true;
fpVrControls.movementSpeed = 15;

// Apply VR stereo rendering to renderer.
var effect = new THREE.VREffect(renderer);
effect.setSize(window.innerWidth, window.innerHeight);

// Create a VR manager helper to enter and exit VR mode.
var params = {
  hideButton: false, // Default: false.
  isUndistorted: false // Default: false.
};
var manager = new WebVRManager(renderer, effect, params);

window.addEventListener('resize', onResize, true);
window.addEventListener('vrdisplaypresentchange', onResize, true);

/*** LOAD TEXTURES ***/
/*** SKYBOX: http://www.custommapmakers.org/skyboxes.php ***/
function loadSkyBox() {
  var materials = [
    createMaterial( 'assets/skybox/sky-rt.jpg' ), // right
    createMaterial( 'assets/skybox/sky-lf.jpg' ), // left
    createMaterial( 'assets/skybox/sky-up.jpg' ), // top
    createMaterial( 'assets/skybox/sky-dn.jpg' ), // bottom
    createMaterial( 'assets/skybox/sky-bk.jpg' ), // back
    createMaterial( 'assets/skybox/sky-ft.jpg' )  // front
  ];
  var mesh = new THREE.Mesh( new THREE.BoxGeometry( 10000, 10000, 10000, 1, 1, 1 ), new THREE.MeshFaceMaterial( materials ) );
  mesh.scale.set(-1,1,1); // Set the x scale to be -1, this will turn the cube inside out
  scene.add( mesh );  
}
 
function createMaterial( path ) {
  var texture = loader.load(path);
  var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5 } );
  return material; 
}

// Add a repeating grid as a skybox.
var boxSize = 40;
var loader = new THREE.TextureLoader();
loader.load('assets/textures/grass.png', onTextureLoaded);

function onTextureLoaded(texture) {
  //loadSkyBox();

  setupStage(); // For high end VR devices like Vive and Oculus, take into account the stage parameters provided.
}


//scene.fog = new THREE.FogExp2( 0x000000, 0.00025 );

///////////
// FLOOR //
///////////
var floorTexture = loader.load( 'assets/textures/grass.png' );
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
floorTexture.repeat.set( 3, 3 );
var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
var floorGeometry = new THREE.PlaneGeometry(60, 100, 6, 6); //width, height, widthSegments, heightSegments
var floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.y = -6; //lower = floor lowers
floor.rotation.x = Math.PI / 2; // 1.57
scene.add(floor);

///////////
// WALL //
///////////
var wall_y_pos = -2.3;
var wallTexture = loader.load( 'assets/textures/wall.png' );
wallTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
wallTexture.repeat.set( 1, 1 );
var wallMaterial = new THREE.MeshBasicMaterial( { map: wallTexture, side: THREE.DoubleSide } );
var wallGeometry = new THREE.PlaneGeometry(100, 50, 1, 1); // e/w, n/s

var brickTexture = loader.load( 'assets/textures/brick-wall.jpg' );
brickTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
brickTexture.repeat.set( 1, 1 );
var brickMaterial = new THREE.MeshBasicMaterial( { map: brickTexture, side: THREE.DoubleSide } );
var brickGeometry = new THREE.PlaneGeometry(80, 50, 1, 1);

var wall2 = new THREE.Mesh(wallGeometry, wallMaterial);
var wall3 = new THREE.Mesh(brickGeometry, brickMaterial);
var wall4 = new THREE.Mesh(brickGeometry, brickMaterial);
var wall5 = new THREE.Mesh(brickGeometry, brickMaterial);

/* Back Wall */
wall2.position.x = 0;
wall2.position.y = wall_y_pos;
wall2.position.z = 15;
scene.add(wall2);

/* Left Side Wall */
wall3.position.set(-30, 5, 0);
wall3.rotation.y = Math.PI / 2;
scene.add(wall3);

/* Right Side Wall */
wall4.position.set(30, 5, 0);
wall4.rotation.y = Math.PI / 2;
scene.add(wall4);

///////////////////
// LIGHT  //
///////////////////
var ambientLight = new THREE.AmbientLight( 0x444444 );
//var ambient = new THREE.AmbientLight( 0x101030 );
scene.add( ambientLight );

var directionalLight = new THREE.DirectionalLight( 0xffeedd );
directionalLight.position.set( 0, 0, 1 ).normalize();
//directionalLight.position = camera.position;
//directionalLight.position = navi.position;
scene.add( directionalLight );

var pointLight = new THREE.PointLight(0xffffff);
scene.add( pointLight );

///////////
// SOUND //
///////////
var listener = new THREE.AudioListener();
camera.add( listener );

// sound spheres
var sphere = new THREE.SphereGeometry( 2.5, 4, 2 );
//material_sphere1 = new THREE.MeshPhongMaterial( { ambient: 0xffffff, color: 0x2247B5, shading: THREE.FlatShading, shininess: 0 } );
//material_sphere1 = new THREE.MeshPhongMaterial( { ambient: 0xffffff, color: 0x0000FF, shading: THREE.FlatShading, shininess: 30 } );
material_sphere1 = new THREE.MeshPhongMaterial( { ambient: 0x3C49B1, color: 0x0000FF, shading: THREE.FlatShading, shininess: 30 } );

var audioLoader = new THREE.AudioLoader();

var mesh1 = new THREE.Mesh( sphere, material_sphere1 );
mesh1.position.set(0, 2.5, -20);
scene.add( mesh1 );
var sound1 = new THREE.PositionalAudio( listener );
audioLoader.load( 'assets/sounds/lake-hylia.mp3', function( buffer ) {
  sound1.setBuffer( buffer );
  sound1.setRefDistance( 0.03 );
  sound1.setVolume(100);
  sound1.setLoop(true);
  sound1.play();
});
mesh1.add( sound1 );

/////////////
// OBJECTS //
/////////////

// Sun
sun = new Sun();
sun.Create(0, 200, 0, scene, renderer);
objects.push(sun);

// Water
var water = new Water();
water.Create(scene);
objects.push(water);

// Trees
var tree = new Tree();
tree.Create(0, 10, 0, scene, renderer);
objects.push(tree);


// Request animation frame loop function
var lastRender = 0;
function animate(timestamp) {
  var delta = Math.min(timestamp - lastRender, 500);
  lastRender = timestamp;
  var elapsed = clock.getElapsedTime();

  mesh1.rotation.y += delta * 0.0006;

  renderNavi();

  vrControls.update();
  fpVrControls.update(timestamp);

  manager.render(scene, camera, timestamp);

  effect.render(scene, camera);

  vrDisplay.requestAnimationFrame(animate);
}

function onResize(e) {
  effect.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

var vrDisplay;
function setupStage() {
  //get the HMD and if we're dealing with something that specifies stageParameters, rearrange the scene.
  navigator.getVRDisplays().then(function(displays) {
    if (displays.length > 0) {
      vrDisplay = displays[0];
      if (vrDisplay.stageParameters) {
        setStageDimensions(vrDisplay.stageParameters);
      }
      vrDisplay.requestAnimationFrame(animate);
    }
  });
}

function setStageDimensions(stage) {
  
}