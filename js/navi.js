var camera, scene, renderer, controls;
var origin, follower;
var direction = new THREE.Vector3(0, 0, 1);
var direction_follower = new THREE.Vector3(0, 0, 1);
var speed = 1000; // units per second
var follower_speed = 500;
var clock = new THREE.Clock();
var delta, shift = new THREE.Vector3(), shift_follower = new THREE.Vector3();
var epsilon = speed / 60;

init();
animate();

function init() {

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 20000);
  camera.position.set(-1, 1, 0).setLength(10000);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  //renderer.setClearColor(0xCCCCCC);
  document.body.appendChild(renderer.domElement);

  controls = new THREE.OrbitControls(camera, renderer.domElement);

  var plane = new THREE.GridHelper(5000, 10, 0xffffff, 0x555555);
	
  var geometry = new THREE.BoxGeometry(100, 100, 1000);
  origin = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial({
    color: "red"
  }));
  origin.position.set(5000, 0, 0);
  scene.add(origin);
  
  follower = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial({color: "green"}));
	follower.position.set(-5000, 0, 0);
  scene.add(follower);

  scene.add(plane);
}


// animate
function animate() {
  delta = clock.getDelta();
  requestAnimationFrame(animate);
	
  if (origin.position.z > 5000) { direction.negate();origin.position.z = 5000;}
  if (origin.position.z < -5000) { direction.negate();origin.position.z = -5000;}
  shift.copy(direction).normalize().multiplyScalar(speed * delta);
  origin.position.add(shift);
  
	if (follower.position.z > 5000) { direction_follower.negate();follower.position.z = 5000;}
  if (follower.position.z < -5000) { direction_follower.negate();follower.position.z = -5000;}
  
  
  if (Math.sign(direction_follower.z) != Math.sign(direction.z)){
  	if (follower.position.z <= origin.position.z + epsilon && follower.position.z >= origin.position.z - epsilon) direction_follower.negate();
  }
  
  shift_follower.copy(direction_follower).normalize().multiplyScalar(follower_speed * delta);
  follower.position.add(shift_follower);

  render();
}

function render() {
  renderer.render(scene, camera);
}
