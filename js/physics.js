/*
 *** PHYSICS JS ***
*/

/*** JUMPPADS ***/
var jumpPads = (function() {
  var pads = [ new THREE.Vector3( -17.5, 8, -10 ), new THREE.Vector3( 17.5, 8, -10 ), new THREE.Vector3( 0, 8, 21 ) ];
  var temp = new THREE.Vector3();

  return function() {
    if( !motion.airborne ) {
      for( var j = 0, n = pads.length; j < n; j++ ) {
        if ( pads[j].distanceToSquared( motion.position ) < 2.3 ) {

          // calculate velocity towards another side of platform from jump pad position
          temp.copy( pads[j] ); temp.y = 0; temp.setLength( -0.8 ); temp.y = 0.7;

          motion.airborne = true; motion.velocity.copy( temp ); break;
        }
      }
    }
  };
})();

/*** PHYSICS ***/
var applyPhysics = (function() {
  var timeStep = 5;
  var timeLeft = timeStep + 1;

  var birdsEye = 100;
  var kneeDeep = 0.4;

  var raycaster = new THREE.Raycaster();
  raycaster.ray.direction.set( 0, -1, 0 );

  var angles = new THREE.Vector2();
  var displacement = new THREE.Vector3();

  return function( dt ) {
    var platform = scene.getObjectByName( "platform", true );
    if( platform ) {

      timeLeft += dt;

      // run several fixed-step iterations to approximate varying-step

      dt = 5;
      while( timeLeft >= dt ) {

        var time = 0.3, damping = 0.93, gravity = 0.01, tau = 2 * Math.PI;

        raycaster.ray.origin.copy( motion.position );
        raycaster.ray.origin.y += birdsEye;

        var hits = raycaster.intersectObject( platform );

        motion.airborne = true;

        // are we above, or at most knee deep in, the platform?

        if( ( hits.length > 0 ) && ( hits[0].face.normal.y > 0 ) ) {
          var actualHeight = hits[0].distance - birdsEye;

          // collision: stick to the surface if landing on it

          if( ( motion.velocity.y <= 0 ) && ( Math.abs( actualHeight ) < kneeDeep ) ) {
            motion.position.y -= actualHeight;
            motion.velocity.y = 0;
            motion.airborne = false;
          }
        }

        if( motion.airborne ) motion.velocity.y -= gravity;

        angles.copy( motion.spinning ).multiplyScalar( time );
        if( !motion.airborne ) motion.spinning.multiplyScalar( damping );

        displacement.copy( motion.velocity ).multiplyScalar( time );
        if( !motion.airborne ) motion.velocity.multiplyScalar( damping );

        motion.rotation.add( angles );
        motion.position.add( displacement );

        // limit the tilt at ±0.4 radians

        motion.rotation.x = Math.max( -0.4, Math.min ( +0.4, motion.rotation.x ) );

        // wrap horizontal rotation to 0...2π

        motion.rotation.y += tau; motion.rotation.y %= tau;

        timeLeft -= dt;
      }
    }
  };
})();