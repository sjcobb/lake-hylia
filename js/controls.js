/*
 *** CONTROLS JS ***
*/

var keyboardControls = (function() {

  var keys = { SP : 32, W : 87, A : 65, S : 83, D : 68, UP : 38, LT : 37, DN : 40, RT : 39 };

  var keysPressed = {};

  (function( watchedKeyCodes ) {
    var handler = function( down ) {
      return function( e ) {
        var index = watchedKeyCodes.indexOf( e.keyCode );
        if( index >= 0 ) {
          keysPressed[watchedKeyCodes[index]] = down; e.preventDefault();
        }
      };
    };
    window.addEventListener( "keydown", handler( true ), false );
    window.addEventListener( "keyup", handler( false ), false );
  })([
    keys.SP, keys.W, keys.A, keys.S, keys.D, keys.UP, keys.LT, keys.DN, keys.RT
  ]);

  var forward = new THREE.Vector3();
  var sideways = new THREE.Vector3();

  return function() {
    if( !motion.airborne ) {

      // look around
      var sx = keysPressed[keys.UP] ? 0.03 : ( keysPressed[keys.DN] ? -0.03 : 0 );
      var sy = keysPressed[keys.LT] ? 0.03 : ( keysPressed[keys.RT] ? -0.03 : 0 );

      if( Math.abs( sx ) >= Math.abs( motion.spinning.x ) ) motion.spinning.x = sx;
      if( Math.abs( sy ) >= Math.abs( motion.spinning.y ) ) motion.spinning.y = sy;

      // move around
      forward.set( Math.sin( motion.rotation.y ), 0, Math.cos( motion.rotation.y ) );
      sideways.set( forward.z, 0, -forward.x );

      forward.multiplyScalar( keysPressed[keys.W] ? -0.1 : (keysPressed[keys.S] ? 0.1 : 0));
      sideways.multiplyScalar( keysPressed[keys.A] ? -0.1 : (keysPressed[keys.D] ? 0.1 : 0));

      var combined = forward.add( sideways );
      if( Math.abs( combined.x ) >= Math.abs( motion.velocity.x ) ) motion.velocity.x = combined.x;
      if( Math.abs( combined.y ) >= Math.abs( motion.velocity.y ) ) motion.velocity.y = combined.y;
      if( Math.abs( combined.z ) >= Math.abs( motion.velocity.z ) ) motion.velocity.z = combined.z;

      //jump
      var vy = keysPressed[keys.SP] ? 0.7 : 0;
      motion.velocity.y += vy;
    }
  };
})();

/*** RESET PLAYER ***/
var resetPlayer = function() {
  if( motion.position.y < -123 ) {
    motion.position.set( -2, 7.7, 25 );
    motion.velocity.multiplyScalar( 0 );
  }
};