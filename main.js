var windowWidth  = window.innerWidth * window.devicePixelRatio;
var windowHeight  = window.innerHeight * window.devicePixelRatio;

//create scene
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.sortObjects = true;
document.body.appendChild(renderer.domElement); 

//create views
var views = [
    { 
        left: 0,
        bottom: 0.5,
        width: 0.5,
        height: 0.5,
        background: { r: 0.0, g: 0.0, b: 0.0, a: 1 },
        eye: [ 0, 300, 1800 ],
        up: [ 0, 1, 0 ],
        fov: 30,
        angle : 0,
        rotation: 33.75
    },
    { 
        left: 0,
        bottom: 0,
        width: 0.5,
        height: 0.5,
        background: { r: 0.0, g: 0.0, b: 0.0, a: 1 },
        eye: [ 0, 300, 1800 ],
        up: [ 0, 1, 0 ],
        fov: 30,
        angle: 90,
        rotation: 101.25
    },
    { 
        left: 0.5,
        bottom: 0,
        width: 0.5,
        height: 0.5,
        background: { r: 0.0, g: 0.0, b: 0.0, a: 1 },
        eye: [ 0, 300, 1800 ],
        up: [ 0, 1, 0 ],
        fov: 30,
        angle: 180,
        rotation: -101.25
    },
    { 
        left: 0.5,
        bottom: 0.5,
        width: 0.5,
        height: 0.5,
        background: { r: 0.0, g: 0.0, b: 0.0, a: 1 },
        eye: [ 0, 300, 1800 ],
        up: [ 0, 1, 0 ],
        fov: 30,
        angle: 270,
        rotation: 101.25
    }
];

window.ambient = new THREE.AmbientLight( 0xEEEEEE )
scene.add( ambient )

// load model
treeObj = new THREE.Object3D()
var treeModel;
var loader = new THREE.ColladaLoader();
loader.options.convertUpAxis = true;
loader.load( 'media/christmasTree1.dae', function ( collada ) {
    treeModel = collada.scene;
    treeModel.scale.x =treeModel.scale.y =treeModel.scale.z = 0.8;
    treeModel.position.x= 0;
    treeModel.position.z= 0;
    treeModel.position.y= -50;

    treeModel.rotation.set(0,0,0); // Set initial rotation
    //treeModel.matrix.setRotationFromEuler(treeModel.rotation);

    treeObj.add(treeModel);
    //treeObj.useQuaternion = true;
});
scene.add(treeObj);

// create the stars
var pMaterial = new THREE.ParticleBasicMaterial({
  color: 0xFFFFFF,
  size: 10,
  map: THREE.ImageUtils.loadTexture(
    "media/ParticleSmoke.png"
  ),
  transparent: true,
  blending: THREE.AdditiveBlending,
  alphaTest: 0.5
});
var particleCount = 1800;
var particles = new THREE.Geometry();
for(var p = 0; p < particleCount; p++) {
var pX = Math.random() * 1000 - 500,
    pY = Math.random() * 1000 - 500,
    pZ = Math.random() * 1000 - 500,
    particle = new THREE.Vector3(pX, pY, pZ);

    // create a velocity vector
    particle.velocity = new THREE.Vector3(
      0,              // x
      -Math.random(), // y: random vel
      0);             // z

    particles.vertices.push(particle);
}
window.particleSystem = new THREE.ParticleSystem(particles, pMaterial);
particleSystem.sortParticles = true;
scene.add(particleSystem);

function updateParticleSystem()
{
  var pCount = particleCount;
  while (pCount--) {

    // get the particle
    var particle = particles.vertices[pCount];

    // check if we need to reset
    if (particle.y < -300) {
      particle.y = 300;
      particle.velocity.y = 0;
    }

    // update the velocity with
    // a splat of randomniz
    particle.velocity.y -= Math.random() * .001;

    // and the position
    particle.add(particle.velocity);
  }

  // flag to the particle system
  // that we've changed its vertices.
  particleSystem.geometry.verticesNeedUpdate = true;
}

//clouds object
// window.clouds = new THREE.Mesh(
// new THREE.SphereGeometry( 50 + 1, 32, 32 ),
// new THREE.MeshLambertMaterial({ 
//   map: THREE.ImageUtils.loadTexture( 'media/clouds.jpg' ),
//   transparent: true,
//   blending: THREE.CustomBlending,
//   blendSrc: THREE.SrcAlphaFactor,
//   blendDst: THREE.OneMinusSrcColorFactor,
//   blendEquation: THREE.AddEquation
// })
// )
// clouds.position.set( 0, 0, 0 )
// clouds.receiveShadow = true
// clouds.castShadow = true
// scene.add( clouds )


// //earth object
// var earthBumpImage = THREE.ImageUtils.loadTexture( "media/earthBumpMap.jpg" );
// var geometry = new THREE.SphereGeometry(50, 40, 40)
// var material = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture( 'media/earthSatTexture.jpg' ), ambient: 0x050505, color: 0xFFFFFF, specular: 0x555555, bumpMap: earthBumpImage, bumpScale: 19, metal: true } );
// window.earth = new THREE.Mesh( geometry, material );
// scene.add(earth);


//add cameras
for (var i =  0; i < views.length; i++ ) {
    var view = views[i];
    var camera = new THREE.PerspectiveCamera( view.fov, windowWidth / windowHeight, 1, 10000 );
    camera.position.x = view.eye[ 0 ];
    camera.position.y = view.eye[ 1 ];
    camera.position.z = view.eye[ 2 ];
    camera.up.x = view.up[ 0 ];
    camera.up.y = view.up[ 1 ];
    camera.up.z = view.up[ 2 ];
    view.camera = camera;
}


//initite variables
var firstValidFrame = null
var cameraRadius = 290
var rotateY = 90, rotateX = 0, curY = 0


//window resize method
window.addEventListener( 'resize', onWindowResize, false );
function onWindowResize(){
    windowWidth  = window.innerWidth * window.devicePixelRatio;
    windowHeight  = window.innerHeight * window.devicePixelRatio;

    for (var i =  0; i < views.length; i++ ) {
        var view = views[i]
        var camera = view.camera;
        camera.aspect = windowWidth / windowHeight;
        camera.updateProjectionMatrix();
    }

    renderer.setSize(window.innerWidth, window.innerHeight);

}


var _q1 = new THREE.Quaternion();
var axisX = new THREE.Vector3( 0, 1, 0 )
function rotateOnAxis( object, axis, angle ) {

    _q1.setFromAxisAngle( axis, angle );
    object.quaternion.multiplySelf( _q1 );

} 

		
function updateSize() {

    if ( windowWidth != window.innerWidth || windowHeight != window.innerHeight ) {

        windowWidth  = window.innerWidth;
        windowHeight = window.innerHeight;

        renderer.setSize ( windowWidth, windowHeight );

    }

}

function render(){
    updateSize()

    //rotate scene objects
    //clouds.rotation.y+=.003
    //earth.rotation.y+=.003
    //rotateOnAxis(treeObj, axisX, .008);
    treeObj.rotation.y+=.003
    particleSystem.rotation.y+=.003

    updateParticleSystem();

    //for each view
    for (var i =  0; i < views.length; i++ ) {
        //grab each view
        var view = views[i]

        //grab each camera
        var camera = view.camera;

        //Adjust camera within 3D spherical coordinates
        camera.position.x = 0 + cameraRadius * Math.sin(rotateY * Math.PI/180) * Math.cos(view.angle * Math.PI/180)
        camera.position.z = 0 + cameraRadius * Math.sin(rotateY * Math.PI/180) * Math.sin(view.angle * Math.PI/180)
        camera.position.y = 0 + cameraRadius * Math.cos(rotateY * Math.PI/180)
        camera.lookAt(scene.position)

        //Set rotation of camera on Z-Axis
        camera.rotation.z= view.rotation - Math.PI;

        //Grab view ports
        var left   = Math.floor( windowWidth  * view.left );
        var bottom = Math.floor( windowHeight * view.bottom );
        var width  = Math.floor( windowWidth  * view.width );
        var height = Math.floor( windowHeight * view.height );

        //Render
        renderer.setViewport( left, bottom, width, height );
        renderer.setScissor( left, bottom, width, height );
        renderer.enableScissorTest ( true );
        renderer.setClearColor( view.background, view.background.a );

        renderer.render(scene, camera)
    }
}


function animate(){
    render();

    requestAnimationFrame( animate );
}


//start animation loop
animate();