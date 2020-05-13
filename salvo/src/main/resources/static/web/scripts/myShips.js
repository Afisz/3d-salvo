//Ships 3d models by:
//Super Rib (Patrol Boat): Mike Rowley //(https://sketchfab.com/scrumpy26)

//The Project 941 / Akula / Typhoon submarine (Submarine): yakudami //(https://sketchfab.com/yakudami)

//Warship. (Destroyer): Pixel
//(https://sketchfab.com/3d_constructor)

//USS Zumwalt (DDG-1000) (Battleship): yakudami
//(https://sketchfab.com/yakudami)

//Ark Royal (Aircraft Carrier): ThomasBeerens (w/modifications to the original model)
//(https://sketchfab.com/ThomasBeerens)

'use strict'


var scene1, camera1, renderer1, water1, scene2, camera2, renderer2, water2, updatedBoat;

var boat = [];

var pos1 = [];

var pos2 = [];

const patrolDistConst = 1 / 0.01;

const submarineDistConst = 1 / 0.105;

const destroyerDistConst = 1 / 0.015;

const battleshipDistConst = 1 / 0.15;

const carrierDistConst = 1 / 0.02;

var mouse1 = new THREE.Vector2();

var params = {
  color: '#ffffff',
  scale: 10,
  flowX: 0.5,
  flowY: 0.5
};

var myShipsGrid = document.getElementById('my-ships-grid');


//Ships not placed

//Init
function init () {

  //Scene
  scene1 = new THREE.Scene();

  scene1.position.x = -5;
  scene1.position.z= -5;


  //Camera
  camera1 = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 125);
  camera1.position.set(-11, 9, 11);
  camera1.lookAt(scene1.position);


  //Ground
  var groundGeometry = new THREE.PlaneBufferGeometry(250, 250);
  var groundMaterial = new THREE.MeshStandardMaterial({
    color: 0X4D87BD,
    roughness: 1,
    metalness: 0
  });
  groundMaterial.map = null;
  var ground = new THREE.Mesh(groundGeometry, groundMaterial);

  ground.position.x = 5;
  ground.position.z = 5;

  ground.rotation.x = Math.PI * -0.5;
  scene1.add(ground);


  //Water
  var waterGeometry = new THREE.PlaneBufferGeometry(250, 250);

  water1 = new THREE.Water(waterGeometry, {
    color: params.color,
    scale: params.scale,
    flowDirection: new THREE.Vector2(params.flowX, params.flowY),
    textureWidth: 1024,
    textureHeight: 1024
  });

  water1.position.x = 5;
  water1.position.y = 0.001;
  water1.position.z = 5;

  water1.rotation.x = Math.PI * -0.5;

  scene1.add(water1);


  //Grid
  var size = 10;

  var divisions = 10;

  var gridHelper = new THREE.GridHelper(size, divisions, 0x000000, 0x000000);

  gridHelper.position.x = 5;
  gridHelper.position.y = 0.002;
  gridHelper.position.z = 5;

  scene1.add(gridHelper);


  //Ships
  var loader = new THREE.GLTFLoader();

  var boats = ['patrol', 'submarine', 'destroyer', 'battleship', 'carrier'];

  for (let i = 0; i < boats.length; i++) {

    let url = '3d/models/' + boats[i] + '/scene.gltf';

    loader.load(url, function (gltf) {

      switch (boats[i]) {
        case 'patrol':
          gltf.scene.scale.set(0.01, 0.01, 0.01);
          gltf.scene.rotation.y = Math.PI * 0.5;
          gltf.scene.position.x = 1.133 + 5;
          gltf.scene.position.y = 0.2;
          gltf.scene.position.z = 0.5 + 1;
          break;

        case 'submarine':
          gltf.scene.scale.set(0.105, 0.105, 0.105);
          gltf.scene.rotation.y = Math.PI * -0.5;
          gltf.scene.position.x = 1.54 + 4;
          gltf.scene.position.y = 0;
          gltf.scene.position.z = 0.5 + 3;
          break;

        case 'destroyer':
          gltf.scene.scale.set(0.015, 0.015, 0.015);
          gltf.scene.rotation.y = Math.PI * 0.5;
          gltf.scene.position.x = 1.7 + 4;
          gltf.scene.position.y = 0.25;
          gltf.scene.position.z = 0.5 + 5;
          break;

        case 'battleship':
          gltf.scene.scale.set(0.15, 0.15, 0.15);
          gltf.scene.rotation.y = Math.PI * -0.5;
          gltf.scene.position.x = 2 + 3;
          gltf.scene.position.y = 0.11;
          gltf.scene.position.z = 0.5 + 7;
          break;

        case 'carrier':
          gltf.scene.scale.set(0.02, 0.02, 0.02);
          gltf.scene.rotation.y = Math.PI;
          gltf.scene.position.x = 2.52 + 2;
          gltf.scene.position.y = 0;
          gltf.scene.position.z = 0.5 + 9;
          break;
      }

      gltf.scene.name = boats[i];

      pos1.push(gltf.scene);

      scene1.add(gltf.scene);

    }, (xhr) => xhr, (err) => console.error(err));
  }


  //Background
  var cubeTextureLoader = new THREE.CubeTextureLoader();

  cubeTextureLoader.setPath('3d/img/skyboxsun25deg/');

  var cubeTexture = cubeTextureLoader.load([
    "px.jpg", "nx.jpg",
    "py.jpg", "ny.jpg",
    "pz.jpg", "nz.jpg"
  ]);

  scene1.background = cubeTexture;


  //Light
  var ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);

  scene1.add(ambientLight);

  var directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);

  directionalLight.position.set(-1, 102.25, 1);

  scene1.add(directionalLight);


  //Renderer
  renderer1 = new THREE.WebGLRenderer({
    //antialias: false
  });

  renderer1.setSize(window.innerWidth, window.innerHeight);

  renderer1.setPixelRatio(window.devicePixelRatio);

  myShipsGrid.appendChild(renderer1.domElement);


  //Camera controls
  var orbitControls = new THREE.OrbitControls(camera1, renderer1.domElement);

  orbitControls.minDistance = 8;
  orbitControls.maxDistance = 23;

  orbitControls.minPolarAngle = 0.7;
  orbitControls.maxPolarAngle = Math.PI / 2.3;


  //Drag controls
  var dragControls = new THREE.DragControls(pos1, camera1, renderer1.domElement);

  dragControls.addEventListener( 'dragstart', function (event) {
    orbitControls.enabled = false;

    boat = pos1.filter(object => object.name == event.object.name)[0];
  });

  dragControls.addEventListener ( 'drag', function (event) {

    //Drag limits in the 3 axis for each ship
    switch (event.object.name) {
      case 'patrol':
        event.object.position.y = 0;

        if (boat.rotation.y == Math.PI) {
          //Horizontal
          let posX = 6 - (app.ships.patrol.actualPosition.x + event.object.position.x / patrolDistConst - app.ships.patrol.actualCenter.x);
          let posZ = 1 - (app.ships.patrol.actualPosition.z - (event.object.position.z / patrolDistConst - app.ships.patrol.actualCenter.z));

          if (posZ < 0 && posX < 0) {
            event.object.position.x = (6 - app.ships.patrol.actualPosition.x + app.ships.patrol.actualCenter.x) * patrolDistConst;
            event.object.position.z = (-1 + app.ships.patrol.actualPosition.z + app.ships.patrol.actualCenter.z) * patrolDistConst;
          } else if (posZ > 8 && posX < 0) {
            event.object.position.x = (6 - app.ships.patrol.actualPosition.x + app.ships.patrol.actualCenter.x) * patrolDistConst;
            event.object.position.z = (7 + app.ships.patrol.actualPosition.z + app.ships.patrol.actualCenter.z) * patrolDistConst;
          } else if (posZ < 0 && posX > 9) {
            event.object.position.x = (-3 - app.ships.patrol.actualPosition.x + app.ships.patrol.actualCenter.x) * patrolDistConst;
            event.object.position.z = (-1 + app.ships.patrol.actualPosition.z + app.ships.patrol.actualCenter.z) * patrolDistConst;
          } else if (posZ > 8 && posX > 9) {
            event.object.position.x = (-3 - app.ships.patrol.actualPosition.x + app.ships.patrol.actualCenter.x) * patrolDistConst;
            event.object.position.z = (7 + app.ships.patrol.actualPosition.z + app.ships.patrol.actualCenter.z) * patrolDistConst;
          } else if (posX < 0) {
            event.object.position.x = (6 - app.ships.patrol.actualPosition.x + app.ships.patrol.actualCenter.x) * patrolDistConst;
          } else if (posX > 9) {
            event.object.position.x = (-3 - app.ships.patrol.actualPosition.x + app.ships.patrol.actualCenter.x) * patrolDistConst;
          } else if (posZ < 0) {
            event.object.position.z = (-1 + app.ships.patrol.actualPosition.z + app.ships.patrol.actualCenter.z) * patrolDistConst;
          } else if (posZ > 8) {
            event.object.position.z = (7 + app.ships.patrol.actualPosition.z + app.ships.patrol.actualCenter.z) * patrolDistConst;
          }
        } else {
          //Vertical
          let posX = 5 - (app.ships.patrol.actualPosition.x + event.object.position.z / patrolDistConst - app.ships.patrol.actualCenter.z);
          let posZ = 1 - (app.ships.patrol.actualPosition.z + event.object.position.x / patrolDistConst - app.ships.patrol.actualCenter.x);

          if (posZ < 0 && posX < 0) {
            event.object.position.x = (1 - app.ships.patrol.actualPosition.z + app.ships.patrol.actualCenter.x) * patrolDistConst;
            event.object.position.z = (5 - app.ships.patrol.actualPosition.x + app.ships.patrol.actualCenter.z) * patrolDistConst;
          } else if (posZ > 9 && posX < 0) {
            event.object.position.x = (-8 - app.ships.patrol.actualPosition.z + app.ships.patrol.actualCenter.x) * patrolDistConst;
            event.object.position.z = (5 - app.ships.patrol.actualPosition.x + app.ships.patrol.actualCenter.z) * patrolDistConst;
          } else if (posZ > 9 && posX > 8) {
            event.object.position.x = (-8 - app.ships.patrol.actualPosition.z + app.ships.patrol.actualCenter.x) * patrolDistConst;
            event.object.position.z = (-3 - app.ships.patrol.actualPosition.x + app.ships.patrol.actualCenter.z) * patrolDistConst;
          } else if (posZ < 0 && posX > 8) {
            event.object.position.x = (1 - app.ships.patrol.actualPosition.z + app.ships.patrol.actualCenter.x) * patrolDistConst;
            event.object.position.z = (-3 - app.ships.patrol.actualPosition.x + app.ships.patrol.actualCenter.z) * patrolDistConst;
          } else if (posZ > 9) {
            event.object.position.x = (-8 - app.ships.patrol.actualPosition.z + app.ships.patrol.actualCenter.x) * patrolDistConst;
          } else if (posZ < 0) {
            event.object.position.x = (1 - app.ships.patrol.actualPosition.z + app.ships.patrol.actualCenter.x) * patrolDistConst;
          } else if (posX < 0) {
            event.object.position.z = (5 - app.ships.patrol.actualPosition.x + app.ships.patrol.actualCenter.z) * patrolDistConst;
          } else if (posX > 8) {
            event.object.position.z = (-3 - app.ships.patrol.actualPosition.x + app.ships.patrol.actualCenter.z) * patrolDistConst;
          }
        }
          break;

      case 'submarine':
        event.object.position.z = 0;

        if (boat.rotation.y == -Math.PI / 2) {
          //Vertical
          let posX = 4 - (app.ships.submarine.actualPosition.x + event.object.position.y / submarineDistConst - app.ships.submarine.actualCenter.z);
          let posZ = 3 + app.ships.submarine.actualPosition.z + event.object.position.x / submarineDistConst - app.ships.submarine.actualCenter.x;

          if (posZ < 0 && posX < 0) {
            event.object.position.x = (-3 - app.ships.submarine.actualPosition.z + app.ships.submarine.actualCenter.x) * submarineDistConst;
            event.object.position.y = (4 - app.ships.submarine.actualPosition.x + app.ships.submarine.actualCenter.z) * submarineDistConst;
          } else if (posZ > 9 && posX < 0) {
            event.object.position.x = (6 - app.ships.submarine.actualPosition.z + app.ships.submarine.actualCenter.x) * submarineDistConst;
            event.object.position.y = (4 - app.ships.submarine.actualPosition.x + app.ships.submarine.actualCenter.z) * submarineDistConst;
          } else if (posZ > 9 && posX > 7) {
            event.object.position.x = (6 - app.ships.submarine.actualPosition.z + app.ships.submarine.actualCenter.x) * submarineDistConst;
            event.object.position.y = (-3 - app.ships.submarine.actualPosition.x + app.ships.submarine.actualCenter.z) * submarineDistConst;
          } else if (posZ < 0 && posX > 7) {
            event.object.position.x = (-3 - app.ships.submarine.actualPosition.z + app.ships.submarine.actualCenter.x) * submarineDistConst;
            event.object.position.y = (-3 - app.ships.submarine.actualPosition.x + app.ships.submarine.actualCenter.z) * submarineDistConst;
          } else if (posZ > 9) {
            event.object.position.x = (6 - app.ships.submarine.actualPosition.z + app.ships.submarine.actualCenter.x) * submarineDistConst;
          } else if (posZ < 0) {
            event.object.position.x = (-3 - app.ships.submarine.actualPosition.z + app.ships.submarine.actualCenter.x) * submarineDistConst;
          } else if (posX < 0) {
            event.object.position.y = (4 - app.ships.submarine.actualPosition.x + app.ships.submarine.actualCenter.z) * submarineDistConst;
          } else if (posX > 7) {
            event.object.position.y = (-3 - app.ships.submarine.actualPosition.x + app.ships.submarine.actualCenter.z) * submarineDistConst;
          }
        } else {
          //Horizontal
          let posX = 6 - (app.ships.submarine.actualPosition.x - (event.object.position.x / submarineDistConst - app.ships.submarine.actualCenter.x));
          let posZ = 3 + app.ships.submarine.actualPosition.z + event.object.position.y / submarineDistConst - app.ships.submarine.actualCenter.z;

          if (posZ < 0 && posX < 0) {
            event.object.position.x = (-6 + app.ships.submarine.actualPosition.x + app.ships.submarine.actualCenter.x) * submarineDistConst;
            event.object.position.y = (-3 - app.ships.submarine.actualPosition.z + app.ships.submarine.actualCenter.z) * submarineDistConst;
          } else if (posZ > 7 && posX < 0) {
            event.object.position.x = (-6 + app.ships.submarine.actualPosition.x + app.ships.submarine.actualCenter.x) * submarineDistConst;
            event.object.position.y = (4 - app.ships.submarine.actualPosition.z + app.ships.submarine.actualCenter.z) * submarineDistConst;
          } else if (posZ < 0 && posX > 9) {
            event.object.position.x = (3 + app.ships.submarine.actualPosition.x + app.ships.submarine.actualCenter.x) * submarineDistConst;
            event.object.position.y = (-3 - app.ships.submarine.actualPosition.z + app.ships.submarine.actualCenter.z) * submarineDistConst;
          } else if (posZ > 7 && posX > 9) {
            event.object.position.x = (3 + app.ships.submarine.actualPosition.x + app.ships.submarine.actualCenter.x) * submarineDistConst;
            event.object.position.y = (4 - app.ships.submarine.actualPosition.z + app.ships.submarine.actualCenter.z) * submarineDistConst;
          } else if (posX < 0) {
            event.object.position.x = (-6 + app.ships.submarine.actualPosition.x + app.ships.submarine.actualCenter.x) * submarineDistConst;
          } else if (posX > 9) {
            event.object.position.x = (3 + app.ships.submarine.actualPosition.x + app.ships.submarine.actualCenter.x) * submarineDistConst;
          } else if (posZ < 0) {
            event.object.position.y = (-3 - app.ships.submarine.actualPosition.z + app.ships.submarine.actualCenter.z) * submarineDistConst;
          } else if (posZ > 7) {
            event.object.position.y = (4 - app.ships.submarine.actualPosition.z + app.ships.submarine.actualCenter.z) * submarineDistConst;
          }
        }
        break;

      case 'destroyer':
        event.object.position.z = 0;

        if (boat.rotation.y == Math.PI / 2) {
          //Vertical
          let posX = 4 - (app.ships.destroyer.actualPosition.x - (event.object.position.y / destroyerDistConst - app.ships.destroyer.actualCenter.z));
          let posZ = 5 + app.ships.destroyer.actualPosition.z - (event.object.position.x / destroyerDistConst - app.ships.destroyer.actualCenter.x);

          if (posZ < 0 && posX < 0) {
            event.object.position.x = (5 + app.ships.destroyer.actualPosition.z + app.ships.destroyer.actualCenter.x) * destroyerDistConst;
            event.object.position.y = (-4 + app.ships.destroyer.actualPosition.x + app.ships.destroyer.actualCenter.z) * destroyerDistConst;
          } else if (posZ > 9 && posX < 0) {
            event.object.position.x = (-4 + app.ships.destroyer.actualPosition.z + app.ships.destroyer.actualCenter.x) * destroyerDistConst;
            event.object.position.y = (-4 + app.ships.destroyer.actualPosition.x + app.ships.destroyer.actualCenter.z) * destroyerDistConst;
          } else if (posZ > 9 && posX > 7) {
            event.object.position.x = (-4 + app.ships.destroyer.actualPosition.z + app.ships.destroyer.actualCenter.x) * destroyerDistConst;
            event.object.position.y = (3 + app.ships.destroyer.actualPosition.x + app.ships.destroyer.actualCenter.z) * destroyerDistConst;
          } else if (posZ < 0 && posX > 7) {
            event.object.position.x = (5 + app.ships.destroyer.actualPosition.z + app.ships.destroyer.actualCenter.x) * destroyerDistConst;
            event.object.position.y = (3 + app.ships.destroyer.actualPosition.x + app.ships.destroyer.actualCenter.z) * destroyerDistConst;
          } else if (posZ > 9) {
            event.object.position.x = (-4 + app.ships.destroyer.actualPosition.z + app.ships.destroyer.actualCenter.x) * destroyerDistConst;
          } else if (posZ < 0) {
            event.object.position.x = (5 + app.ships.destroyer.actualPosition.z + app.ships.destroyer.actualCenter.x) * destroyerDistConst;
          } else if (posX < 0) {
            event.object.position.y = (-4 + app.ships.destroyer.actualPosition.x + app.ships.destroyer.actualCenter.z) * destroyerDistConst;
          } else if (posX > 7) {
            event.object.position.y = (3 + app.ships.destroyer.actualPosition.x + app.ships.destroyer.actualCenter.z) * destroyerDistConst;
          }
        } else {
          //Horizontal
          let posX = 6 - (app.ships.destroyer.actualPosition.x + event.object.position.x / destroyerDistConst - app.ships.destroyer.actualCenter.x);
          let posZ = 5 + app.ships.destroyer.actualPosition.z - (event.object.position.y / destroyerDistConst - app.ships.destroyer.actualCenter.z);

          if (posZ < 0 && posX < 0) {
            event.object.position.x = (6 - app.ships.destroyer.actualPosition.x + app.ships.destroyer.actualCenter.x) * destroyerDistConst;
            event.object.position.y = (5 + app.ships.destroyer.actualPosition.z + app.ships.destroyer.actualCenter.z) * destroyerDistConst;
          } else if (posZ > 7 && posX < 0) {
            event.object.position.x = (6 - app.ships.destroyer.actualPosition.x + app.ships.destroyer.actualCenter.x) * destroyerDistConst;
            event.object.position.y = (-2 + app.ships.destroyer.actualPosition.z + app.ships.destroyer.actualCenter.z) * destroyerDistConst;
          } else if (posZ < 0 && posX > 9) {
            event.object.position.x = (-3 - app.ships.destroyer.actualPosition.x + app.ships.destroyer.actualCenter.x) * destroyerDistConst;
            event.object.position.y = (5 + app.ships.destroyer.actualPosition.z + app.ships.destroyer.actualCenter.z) * destroyerDistConst;
          } else if (posZ > 7 && posX > 9) {
            event.object.position.x = (-3 - app.ships.destroyer.actualPosition.x + app.ships.destroyer.actualCenter.x) * destroyerDistConst;
            event.object.position.y = (-2 + app.ships.destroyer.actualPosition.z + app.ships.destroyer.actualCenter.z) * destroyerDistConst;
          } else if (posX < 0) {
            event.object.position.x = (6 - app.ships.destroyer.actualPosition.x + app.ships.destroyer.actualCenter.x) * destroyerDistConst;
          } else if (posX > 9) {
            event.object.position.x = (-3 - app.ships.destroyer.actualPosition.x + app.ships.destroyer.actualCenter.x) * destroyerDistConst;
          } else if (posZ < 0) {
            event.object.position.y = (5 + app.ships.destroyer.actualPosition.z + app.ships.destroyer.actualCenter.z) * destroyerDistConst;
          } else if (posZ > 7) {
            event.object.position.y = (-2 + app.ships.destroyer.actualPosition.z + app.ships.destroyer.actualCenter.z) * destroyerDistConst;
          }
        }
        break;

      case 'battleship':
        event.object.position.z = 0;

        if (boat.rotation.y == -Math.PI / 2) {
          //Vertical
          let posX = 3 - (app.ships.battleship.actualPosition.x + event.object.position.y / battleshipDistConst - app.ships.battleship.actualCenter.z);
          let posZ = 7 + app.ships.battleship.actualPosition.z + event.object.position.x / battleshipDistConst - app.ships.battleship.actualCenter.x;

          if (posZ < 0 && posX < 0) {
            event.object.position.x = (-7 - app.ships.battleship.actualPosition.z + app.ships.battleship.actualCenter.x) * battleshipDistConst;
            event.object.position.y = (3 - app.ships.battleship.actualPosition.x + app.ships.battleship.actualCenter.z) * battleshipDistConst;
          } else if (posZ > 9 && posX < 0) {
            event.object.position.x = (2 - app.ships.battleship.actualPosition.z + app.ships.battleship.actualCenter.x) * battleshipDistConst;
            event.object.position.y = (3 - app.ships.battleship.actualPosition.x + app.ships.battleship.actualCenter.z) * battleshipDistConst;
          } else if (posZ > 9 && posX > 6) {
            event.object.position.x = (2 - app.ships.battleship.actualPosition.z + app.ships.battleship.actualCenter.x) * battleshipDistConst;
            event.object.position.y = (-3 - app.ships.battleship.actualPosition.x + app.ships.battleship.actualCenter.z) * battleshipDistConst;
          } else if (posZ < 0 && posX > 6) {
            event.object.position.x = (-7 - app.ships.battleship.actualPosition.z + app.ships.battleship.actualCenter.x) * battleshipDistConst;
            event.object.position.y = (-3 - app.ships.battleship.actualPosition.x + app.ships.battleship.actualCenter.z) * battleshipDistConst;
          } else if (posZ > 9) {
            event.object.position.x = (2 - app.ships.battleship.actualPosition.z + app.ships.battleship.actualCenter.x) * battleshipDistConst;
          } else if (posZ < 0) {
            event.object.position.x = (-7 - app.ships.battleship.actualPosition.z + app.ships.battleship.actualCenter.x) * battleshipDistConst;
          } else if (posX < 0) {
            event.object.position.y = (3 - app.ships.battleship.actualPosition.x + app.ships.battleship.actualCenter.z) * battleshipDistConst;
          } else if (posX > 6) {
            event.object.position.y = (-3 - app.ships.battleship.actualPosition.x + app.ships.battleship.actualCenter.z) * battleshipDistConst;
          }
        } else {
          // Horizontal
          let posX = 6 - (app.ships.battleship.actualPosition.x - (event.object.position.x / battleshipDistConst - app.ships.battleship.actualCenter.x));
          let posZ = 7 + app.ships.battleship.actualPosition.z + event.object.position.y / battleshipDistConst - app.ships.battleship.actualCenter.z;

          if (posZ < 0 && posX < 0) {
            event.object.position.x = (-6 + app.ships.battleship.actualPosition.x + app.ships.battleship.actualCenter.x) * battleshipDistConst;
            event.object.position.y = (-7 - app.ships.battleship.actualPosition.z + app.ships.battleship.actualCenter.z) * battleshipDistConst;
          } else if (posZ > 6 && posX < 0) {
            event.object.position.x = (-6 + app.ships.battleship.actualPosition.x + app.ships.battleship.actualCenter.x) * battleshipDistConst;
            event.object.position.y = (-1 - app.ships.battleship.actualPosition.z + app.ships.battleship.actualCenter.z) * battleshipDistConst;
          } else if (posZ < 0 && posX > 9) {
            event.object.position.x = (3 + app.ships.battleship.actualPosition.x + app.ships.battleship.actualCenter.x) * battleshipDistConst;
            event.object.position.y = (-7 - app.ships.battleship.actualPosition.z + app.ships.battleship.actualCenter.z) * battleshipDistConst;
          } else if (posZ > 6 && posX > 9) {
            event.object.position.x = (3 + app.ships.battleship.actualPosition.x + app.ships.battleship.actualCenter.x) * battleshipDistConst;
            event.object.position.y = (-1 - app.ships.battleship.actualPosition.z + app.ships.battleship.actualCenter.z) * battleshipDistConst;
          } else if (posX < 0) {
            event.object.position.x = (-6 + app.ships.battleship.actualPosition.x + app.ships.battleship.actualCenter.x) * battleshipDistConst;
          } else if (posX > 9) {
            event.object.position.x = (3 + app.ships.battleship.actualPosition.x + app.ships.battleship.actualCenter.x) * battleshipDistConst;
          } else if (posZ < 0) {
            event.object.position.y = (-7 - app.ships.battleship.actualPosition.z + app.ships.battleship.actualCenter.z) * battleshipDistConst;
          } else if (posZ > 6) {
            event.object.position.y = (-1 - app.ships.battleship.actualPosition.z + app.ships.battleship.actualCenter.z) * battleshipDistConst;
          }
        }
        break;

      case 'carrier':
        event.object.position.y = 0;

        if (boat.rotation.y == Math.PI) {
          //Vertical
          let posX = 2 - (app.ships.carrier.actualPosition.x + event.object.position.x / carrierDistConst - app.ships.carrier.actualCenter.x);
          let posZ = 9 + app.ships.carrier.actualPosition.z - (event.object.position.z / carrierDistConst - app.ships.carrier.actualCenter.z);

          if (posZ < 0 && posX < 0) {
            event.object.position.x = (2 - app.ships.carrier.actualPosition.x + app.ships.carrier.actualCenter.x) * carrierDistConst;
            event.object.position.z = (9 + app.ships.carrier.actualPosition.z + app.ships.carrier.actualCenter.z) * carrierDistConst;
          } else if (posZ > 9 && posX < 0) {
            event.object.position.x = (2 - app.ships.carrier.actualPosition.x + app.ships.carrier.actualCenter.x) * carrierDistConst;
            event.object.position.z = (0 + app.ships.carrier.actualPosition.z + app.ships.carrier.actualCenter.z) * carrierDistConst;
          } else if (posZ > 9 && posX > 5) {
            event.object.position.x = (-3 - app.ships.carrier.actualPosition.x + app.ships.carrier.actualCenter.x) * carrierDistConst;
            event.object.position.z = (0 + app.ships.carrier.actualPosition.z + app.ships.carrier.actualCenter.z) * carrierDistConst;
          } else if (posZ < 0 && posX > 5) {
            event.object.position.x = (-3 - app.ships.carrier.actualPosition.x + app.ships.carrier.actualCenter.x) * carrierDistConst;
            event.object.position.z = (9 + app.ships.carrier.actualPosition.z + app.ships.carrier.actualCenter.z) * carrierDistConst;
          } else if (posZ > 9) {
            event.object.position.z = (0 + app.ships.carrier.actualPosition.z + app.ships.carrier.actualCenter.z) * carrierDistConst;
          } else if (posZ < 0) {
            event.object.position.z = (9 + app.ships.carrier.actualPosition.z + app.ships.carrier.actualCenter.z) * carrierDistConst;
          } else if (posX < 0) {
            event.object.position.x = (2 - app.ships.carrier.actualPosition.x + app.ships.carrier.actualCenter.x) * carrierDistConst;
          } else if (posX > 5) {
            event.object.position.x = (-3 - app.ships.carrier.actualPosition.x + app.ships.carrier.actualCenter.x) * carrierDistConst;
          }
        } else {
          // Horizontal
          let posX = 6 - (app.ships.carrier.actualPosition.x + event.object.position.z / carrierDistConst - app.ships.carrier.actualCenter.z);
          let posZ = 9 + app.ships.carrier.actualPosition.z + event.object.position.x / carrierDistConst - app.ships.carrier.actualCenter.x;

          if (posZ < 0 && posX < 0) {
            event.object.position.x = (-9 - app.ships.carrier.actualPosition.z + app.ships.carrier.actualCenter.x) * carrierDistConst;
            event.object.position.z = (6 - app.ships.carrier.actualPosition.x + app.ships.carrier.actualCenter.z) * carrierDistConst;
          } else if (posZ > 5 && posX < 0) {
            event.object.position.x = (-4 - app.ships.carrier.actualPosition.z + app.ships.carrier.actualCenter.x) * carrierDistConst;
            event.object.position.z = (6 - app.ships.carrier.actualPosition.x + app.ships.carrier.actualCenter.z) * carrierDistConst;
          } else if (posZ < 0 && posX > 9) {
            event.object.position.x = (-9 - app.ships.carrier.actualPosition.z + app.ships.carrier.actualCenter.x) * carrierDistConst;
            event.object.position.z = (-3 - app.ships.carrier.actualPosition.x + app.ships.carrier.actualCenter.z) * carrierDistConst;
          } else if (posZ > 5 && posX > 9) {
            event.object.position.x = (-4 - app.ships.carrier.actualPosition.z + app.ships.carrier.actualCenter.x) * carrierDistConst;
            event.object.position.z = (-3 - app.ships.carrier.actualPosition.x + app.ships.carrier.actualCenter.z) * carrierDistConst;
          } else if (posX < 0) {
            event.object.position.z = (6 - app.ships.carrier.actualPosition.x + app.ships.carrier.actualCenter.z) * carrierDistConst;
          } else if (posX > 9) {
            event.object.position.z = (-3 - app.ships.carrier.actualPosition.x + app.ships.carrier.actualCenter.z) * carrierDistConst;
          } else if (posZ < 0) {
            event.object.position.x = (-9 - app.ships.carrier.actualPosition.z + app.ships.carrier.actualCenter.x) * carrierDistConst;
          } else if (posZ > 5) {
            event.object.position.x = (-4 - app.ships.carrier.actualPosition.z + app.ships.carrier.actualCenter.x) * carrierDistConst;
          }
        }
        break;
    }

    myShipsGrid.removeEventListener('click', shipsRotation, false);
  });

  dragControls.addEventListener('dragend', function (event) {
    orbitControls.enabled = true;

    updatedBoat = event.object;

    shipsAlignToGrid(event.object);

    setTimeout(function () {
      myShipsGrid.addEventListener('click', shipsRotation, false);
      },50)
  });


  //Events
  window.addEventListener('resize', onResize, false);

  myShipsGrid.addEventListener('mousemove', onMouseMove, false);

  myShipsGrid.addEventListener('click', shipsRotation, false);
}


// Ships align to the grid
function shipsAlignToGrid(ship) {

  let shipDistConst;

  var requiredPositionTrans = [];

  var actualUsedPositionsTrans = [];

  switch (ship.name) {
    case 'patrol':
      shipDistConst = patrolDistConst;
      break;

    case 'submarine':
      shipDistConst = submarineDistConst;
      break;

    case 'destroyer':
      shipDistConst = destroyerDistConst;
      break;

    case 'battleship':
      shipDistConst = battleshipDistConst;
      break;

    case 'carrier':
      shipDistConst = carrierDistConst;
      break;
  }

    //Y (Z for carrier) axis
    if (((ship.name == 'carrier' || ship.name == 'patrol') && Math.abs(ship.position.z % shipDistConst) >= shipDistConst / 2) || (ship.name != 'carrier' && ship.name != 'patrol' && Math.abs(ship.position.y % shipDistConst) >= shipDistConst / 2)) {
      if (ship.name == 'carrier' || ship.name == 'patrol') {
        if (ship.position.z > 0) {
          ship.translateZ(shipDistConst - Math.abs(ship.position.z % shipDistConst));
        } else {
          ship.translateZ(-(shipDistConst - Math.abs(ship.position.z % shipDistConst)));
        }
      } else{
        if (ship.position.y > 0) {
          ship.translateY(shipDistConst - Math.abs(ship.position.y % shipDistConst));
        } else {
          ship.translateY(-(shipDistConst - Math.abs(ship.position.y % shipDistConst)));
        }
      }
    } else {
      if (ship.name == 'carrier' || ship.name == 'patrol') {
        if (ship.position.z > 0) {
          ship.translateZ(-Math.abs(ship.position.z % shipDistConst));
        } else {
          ship.translateZ(Math.abs(ship.position.z % shipDistConst));
        }
      } else{
        if (ship.position.y > 0) {
          ship.translateY(-Math.abs(ship.position.y % shipDistConst));
        } else {
          ship.translateY(Math.abs(ship.position.y % shipDistConst));
        }
      }
    }
    //X axis
    if (Math.abs(ship.position.x % shipDistConst) >= shipDistConst / 2) {
      if (ship.position.x > 0) {
        ship.translateX(shipDistConst - Math.abs(ship.position.x % shipDistConst));
      } else {
        ship.translateX(-(shipDistConst - Math.abs(ship.position.x % shipDistConst)));
      }
    } else {
      if (ship.position.x > 0) {
        ship.translateX(-Math.abs(ship.position.x % shipDistConst));
      } else {
        ship.translateX(Math.abs(ship.position.x % shipDistConst));
      }
    }

      switch (ship.name) {
        case 'patrol':
          let patrolActualCenterX = app.ships.patrol.actualCenter.x;
          let patrolActualCenterZ = app.ships.patrol.actualCenter.z;
          let patrolActualPositionX = app.ships.patrol.actualPosition.x;
          let patrolActualPositionZ = app.ships.patrol.actualPosition.z;
          let patrolRealPositionX = app.ships.patrol.realPosition.x;
          let patrolRealPositionZ = app.ships.patrol.realPosition.z;

          if (boat.rotation.y == Math.PI * 0.5) {
            //Vertical
            app.ships.patrol.actualPosition.x += ship.position.z / shipDistConst - app.ships.patrol.actualCenter.z;
            app.ships.patrol.actualPosition.z += ship.position.x / shipDistConst - app.ships.patrol.actualCenter.x;
            app.ships.patrol.actualCenter.x = ship.position.x / shipDistConst;
            app.ships.patrol.actualCenter.z = ship.position.z / shipDistConst;
            app.ships.patrol.realPosition.x = Math.round(5 - app.ships.patrol.actualPosition.x);
            app.ships.patrol.realPosition.z = Math.round(1 - app.ships.patrol.actualPosition.z);

            requiredPositionTrans.push((app.ships.patrol.realPosition.x).toString() + app.ships.patrol.realPosition.z.toString());
            requiredPositionTrans.push((app.ships.patrol.realPosition.x + 1).toString() + app.ships.patrol.realPosition.z.toString());
            app.ships.shipsData.filter(ship => ship.type != boat.name).map(ship => ship.locations.map(loc => actualUsedPositionsTrans.push(loc)));

            if (actualUsedPositionsTrans.indexOf(requiredPositionTrans[0]) < 0 && actualUsedPositionsTrans.indexOf(requiredPositionTrans[1]) < 0) {
              app.ships.shipsData.map(ship => {if (ship.type == boat.name) {ship.locations = requiredPositionTrans}});
            } else {
              ship.translateX(-(app.ships.patrol.actualCenter.x - patrolActualCenterX) * shipDistConst);
              ship.translateZ(-(app.ships.patrol.actualCenter.z - patrolActualCenterZ) * shipDistConst);
              app.ships.patrol.actualCenter.x = patrolActualCenterX;
              app.ships.patrol.actualCenter.z = patrolActualCenterZ;
              app.ships.patrol.actualPosition.x = patrolActualPositionX;
              app.ships.patrol.actualPosition.z = patrolActualPositionZ;
              app.ships.patrol.realPosition.x = patrolRealPositionX;
              app.ships.patrol.realPosition.z = patrolRealPositionZ;
            }
          } else {
            //Horizontal
            app.ships.patrol.actualPosition.x += ship.position.x / shipDistConst - app.ships.patrol.actualCenter.x;
            app.ships.patrol.actualPosition.z -= ship.position.z / shipDistConst - app.ships.patrol.actualCenter.z;
            app.ships.patrol.actualCenter.x = ship.position.x / shipDistConst;
            app.ships.patrol.actualCenter.z = ship.position.z / shipDistConst;
            app.ships.patrol.realPosition.x = Math.round(6 - app.ships.patrol.actualPosition.x);
            app.ships.patrol.realPosition.z = Math.round(1 - app.ships.patrol.actualPosition.z);

            requiredPositionTrans.push(app.ships.patrol.realPosition.x.toString() + app.ships.patrol.realPosition.z.toString());
            requiredPositionTrans.push(app.ships.patrol.realPosition.x.toString() + (app.ships.patrol.realPosition.z + 1).toString());
            app.ships.shipsData.filter(ship => ship.type != boat.name).map(ship => ship.locations.map(loc => actualUsedPositionsTrans.push(loc)));

            if (actualUsedPositionsTrans.indexOf(requiredPositionTrans[0]) < 0 && actualUsedPositionsTrans.indexOf(requiredPositionTrans[1]) < 0) {
              app.ships.shipsData.map(ship => {if (ship.type == boat.name) {ship.locations = requiredPositionTrans}});
            } else {
              ship.translateX(-(app.ships.patrol.actualCenter.x - actualCenterX) * shipDistConst);
              ship.translateZ(-(app.ships.patrol.actualCenter.z - actualCenterZ) * shipDistConst);
              app.ships.patrol.actualCenter.x = actualCenterX;
              app.ships.patrol.actualCenter.z = actualCenterZ;
              app.ships.patrol.actualPosition.x = actualPositionX;
              app.ships.patrol.actualPosition.z = actualPositionZ;
              app.ships.patrol.realPosition.x = realPositionX;
              app.ships.patrol.realPosition.z = realPositionZ;
            }
          }
          break;

        case 'submarine':
          let submarineActualCenterX = app.ships.submarine.actualCenter.x;
          let submarineActualCenterZ = app.ships.submarine.actualCenter.z;
          let submarineActualPositionX = app.ships.submarine.actualPosition.x;
          let submarineActualPositionZ = app.ships.submarine.actualPosition.z;
          let submarineRealPositionX = app.ships.submarine.realPosition.x;
          let submarineRealPositionZ = app.ships.submarine.realPosition.z;

          if (boat.rotation.y == Math.PI * -0.5) {
            //Vertical
            app.ships.submarine.actualPosition.x += ship.position.y / shipDistConst - app.ships.submarine.actualCenter.z;
            app.ships.submarine.actualPosition.z += ship.position.x / shipDistConst - app.ships.submarine.actualCenter.x;
            app.ships.submarine.actualCenter.x = ship.position.x / shipDistConst;
            app.ships.submarine.actualCenter.z = ship.position.y / shipDistConst;
            app.ships.submarine.realPosition.x = Math.round(4 - app.ships.submarine.actualPosition.x);
            app.ships.submarine.realPosition.z = Math.round(3 + app.ships.submarine.actualPosition.z);

            requiredPositionTrans.push((app.ships.submarine.realPosition.x).toString() + app.ships.submarine.realPosition.z.toString());
            requiredPositionTrans.push((app.ships.submarine.realPosition.x + 1).toString() + app.ships.submarine.realPosition.z.toString());
            requiredPositionTrans.push((app.ships.submarine.realPosition.x + 2).toString() + app.ships.submarine.realPosition.z.toString());
            app.ships.shipsData.filter(ship => ship.type != boat.name).map(ship => ship.locations.map(loc => actualUsedPositionsTrans.push(loc)));

            if (actualUsedPositionsTrans.indexOf(requiredPositionTrans[0]) < 0 && actualUsedPositionsTrans.indexOf(requiredPositionTrans[1]) < 0 && actualUsedPositionsTrans.indexOf(requiredPositionTrans[2]) < 0) {
              app.ships.shipsData.map(ship => {if (ship.type == boat.name) {ship.locations = requiredPositionTrans}});
            } else {
              ship.translateX(-(app.ships.submarine.actualCenter.x - submarineActualCenterX) * shipDistConst);
              ship.translateY(-(app.ships.submarine.actualCenter.z - submarineActualCenterZ) * shipDistConst);
              app.ships.submarine.actualCenter.x = submarineActualCenterX;
              app.ships.submarine.actualCenter.z = submarineActualCenterZ;
              app.ships.submarine.actualPosition.x = submarineActualPositionX;
              app.ships.submarine.actualPosition.z = submarineActualPositionZ;
              app.ships.submarine.realPosition.x = submarineRealPositionX;
              app.ships.submarine.realPosition.z = submarineRealPositionZ;
            }
          } else {
            //Horizontal
            app.ships.submarine.actualPosition.x -= ship.position.x / shipDistConst - app.ships.submarine.actualCenter.x;
            app.ships.submarine.actualPosition.z += ship.position.y / shipDistConst - app.ships.submarine.actualCenter.z;
            app.ships.submarine.actualCenter.x = ship.position.x / shipDistConst;
            app.ships.submarine.actualCenter.z = ship.position.y / shipDistConst;
            app.ships.submarine.realPosition.x = Math.round(6 - app.ships.submarine.actualPosition.x);
            app.ships.submarine.realPosition.z = Math.round(3 + app.ships.submarine.actualPosition.z);

            requiredPositionTrans.push(app.ships.submarine.realPosition.x.toString() + app.ships.submarine.realPosition.z.toString());
            requiredPositionTrans.push(app.ships.submarine.realPosition.x.toString() + (app.ships.submarine.realPosition.z + 1).toString());
            requiredPositionTrans.push(app.ships.submarine.realPosition.x.toString() + (app.ships.submarine.realPosition.z + 2).toString());
            app.ships.shipsData.filter(ship => ship.type != boat.name).map(ship => ship.locations.map(loc => actualUsedPositionsTrans.push(loc)));

            if (actualUsedPositionsTrans.indexOf(requiredPositionTrans[0]) < 0 && actualUsedPositionsTrans.indexOf(requiredPositionTrans[1]) < 0 && actualUsedPositionsTrans.indexOf(requiredPositionTrans[2]) < 0) {
              app.ships.shipsData.map(ship => {if (ship.type == boat.name) {ship.locations = requiredPositionTrans}});
            } else {
              ship.translateX(-(app.ships.submarine.actualCenter.x - submarineActualCenterX) * shipDistConst);
              ship.translateY(-(app.ships.submarine.actualCenter.z - submarineActualCenterZ) * shipDistConst);
              app.ships.submarine.actualCenter.x = submarineActualCenterX;
              app.ships.submarine.actualCenter.z = submarineActualCenterZ;
              app.ships.submarine.actualPosition.x = submarineActualPositionX;
              app.ships.submarine.actualPosition.z = submarineActualPositionZ;
              app.ships.submarine.realPosition.x = submarineRealPositionX;
              app.ships.submarine.realPosition.z = submarineRealPositionZ;
            }
          }
          break;

        case 'destroyer':
          let destroyerActualCenterX = app.ships.destroyer.actualCenter.x;
          let destroyerActualCenterZ = app.ships.destroyer.actualCenter.z;
          let destroyerActualPositionX = app.ships.destroyer.actualPosition.x;
          let destroyerActualPositionZ = app.ships.destroyer.actualPosition.z;
          let destroyerRealPositionX = app.ships.destroyer.realPosition.x;
          let destroyerRealPositionZ = app.ships.destroyer.realPosition.z;

          if (boat.rotation.y == Math.PI * 0.5) {
            //Vertical
            app.ships.destroyer.actualPosition.x -= ship.position.y / shipDistConst - app.ships.destroyer.actualCenter.z;
            app.ships.destroyer.actualPosition.z -= ship.position.x / shipDistConst - app.ships.destroyer.actualCenter.x;
            app.ships.destroyer.actualCenter.x = ship.position.x / shipDistConst;
            app.ships.destroyer.actualCenter.z = ship.position.y / shipDistConst;
            app.ships.destroyer.realPosition.x = Math.round(4 - app.ships.destroyer.actualPosition.x);
            app.ships.destroyer.realPosition.z = Math.round(5 + app.ships.destroyer.actualPosition.z);

            requiredPositionTrans.push((app.ships.destroyer.realPosition.x).toString() + app.ships.destroyer.realPosition.z.toString());
            requiredPositionTrans.push((app.ships.destroyer.realPosition.x + 1).toString() + app.ships.destroyer.realPosition.z.toString());
            requiredPositionTrans.push((app.ships.destroyer.realPosition.x + 2).toString() + app.ships.destroyer.realPosition.z.toString());
            app.ships.shipsData.filter(ship => ship.type != boat.name).map(ship => ship.locations.map(loc => actualUsedPositionsTrans.push(loc)));

            if (actualUsedPositionsTrans.indexOf(requiredPositionTrans[0]) < 0 && actualUsedPositionsTrans.indexOf(requiredPositionTrans[1]) < 0 && actualUsedPositionsTrans.indexOf(requiredPositionTrans[2]) < 0) {
              app.ships.shipsData.map(ship => {if (ship.type == boat.name) {ship.locations = requiredPositionTrans}});
            } else {
              ship.translateX(-(app.ships.destroyer.actualCenter.x - destroyerActualCenterX) * shipDistConst);
              ship.translateY(-(app.ships.destroyer.actualCenter.z - destroyerActualCenterZ) * shipDistConst);
              app.ships.destroyer.actualCenter.x = destroyerActualCenterX;
              app.ships.destroyer.actualCenter.z = destroyerActualCenterZ;
              app.ships.destroyer.actualPosition.x = destroyerActualPositionX;
              app.ships.destroyer.actualPosition.z = destroyerActualPositionZ;
              app.ships.destroyer.realPosition.x = destroyerRealPositionX;
              app.ships.destroyer.realPosition.z = destroyerRealPositionZ;
            }
          } else {
            //Horizontal
            app.ships.destroyer.actualPosition.z -= ship.position.y / shipDistConst - app.ships.destroyer.actualCenter.z;
            app.ships.destroyer.actualPosition.x += ship.position.x / shipDistConst - app.ships.destroyer.actualCenter.x;
            app.ships.destroyer.actualCenter.x = ship.position.x / shipDistConst;
            app.ships.destroyer.actualCenter.z = ship.position.y / shipDistConst;
            app.ships.destroyer.realPosition.x = Math.round(6 - app.ships.destroyer.actualPosition.x);
            app.ships.destroyer.realPosition.z = Math.round(5 + app.ships.destroyer.actualPosition.z);

            requiredPositionTrans.push(app.ships.destroyer.realPosition.x.toString() + app.ships.destroyer.realPosition.z.toString());
            requiredPositionTrans.push(app.ships.destroyer.realPosition.x.toString() + (app.ships.destroyer.realPosition.z + 1).toString());
            requiredPositionTrans.push(app.ships.destroyer.realPosition.x.toString() + (app.ships.destroyer.realPosition.z + 2).toString());
            app.ships.shipsData.filter(ship => ship.type != boat.name).map(ship => ship.locations.map(loc => actualUsedPositionsTrans.push(loc)));

            if (actualUsedPositionsTrans.indexOf(requiredPositionTrans[0]) < 0 && actualUsedPositionsTrans.indexOf(requiredPositionTrans[1]) < 0 && actualUsedPositionsTrans.indexOf(requiredPositionTrans[2]) < 0) {
              app.ships.shipsData.map(ship => {
                if (ship.type == boat.name) {
                  ship.locations = requiredPositionTrans
                }
              });
            } else {
              ship.translateX(-(app.ships.destroyer.actualCenter.x - destroyerActualCenterX) * shipDistConst);
              ship.translateY(-(app.ships.destroyer.actualCenter.z - destroyerActualCenterZ) * shipDistConst);
              app.ships.destroyer.actualCenter.x = destroyerActualCenterX;
              app.ships.destroyer.actualCenter.z = destroyerActualCenterZ;
              app.ships.destroyer.actualPosition.x = destroyerActualPositionX;
              app.ships.destroyer.actualPosition.z = destroyerActualPositionZ;
              app.ships.destroyer.realPosition.x = destroyerRealPositionX;
              app.ships.destroyer.realPosition.z = destroyerRealPositionZ;
            }
          }
          break;

        case 'battleship':
          let battleshipActualCenterX = app.ships.battleship.actualCenter.x;
          let battleshipActualCenterZ = app.ships.battleship.actualCenter.z;
          let battleshipActualPositionX = app.ships.battleship.actualPosition.x;
          let battleshipActualPositionZ = app.ships.battleship.actualPosition.z;
          let battleshipRealPositionX = app.ships.battleship.realPosition.x;
          let battleshipRealPositionZ = app.ships.battleship.realPosition.z;

          if (boat.rotation.y == Math.PI * -0.5) {
            //Vertical
            app.ships.battleship.actualPosition.x += ship.position.y / shipDistConst - app.ships.battleship.actualCenter.z;
            app.ships.battleship.actualPosition.z += ship.position.x / shipDistConst - app.ships.battleship.actualCenter.x;
            app.ships.battleship.actualCenter.x = ship.position.x / shipDistConst;
            app.ships.battleship.actualCenter.z = ship.position.y / shipDistConst;
            app.ships.battleship.realPosition.x = Math.round(3 - app.ships.battleship.actualPosition.x);
            app.ships.battleship.realPosition.z = Math.round(7 + app.ships.battleship.actualPosition.z);

            requiredPositionTrans.push((app.ships.battleship.realPosition.x).toString() + app.ships.battleship.realPosition.z.toString());
            requiredPositionTrans.push((app.ships.battleship.realPosition.x + 1).toString() + app.ships.battleship.realPosition.z.toString());
            requiredPositionTrans.push((app.ships.battleship.realPosition.x + 2).toString() + app.ships.battleship.realPosition.z.toString());
            requiredPositionTrans.push((app.ships.battleship.realPosition.x + 3).toString() + app.ships.battleship.realPosition.z.toString());
            app.ships.shipsData.filter(ship => ship.type != boat.name).map(ship => ship.locations.map(loc => actualUsedPositionsTrans.push(loc)));

            if (actualUsedPositionsTrans.indexOf(requiredPositionTrans[0]) < 0 && actualUsedPositionsTrans.indexOf(requiredPositionTrans[1]) < 0 && actualUsedPositionsTrans.indexOf(requiredPositionTrans[2]) < 0 && actualUsedPositionsTrans.indexOf(requiredPositionTrans[3]) < 0) {
              app.ships.shipsData.map(ship => {if (ship.type == boat.name) {ship.locations = requiredPositionTrans}});
            } else {
              ship.translateX(-(app.ships.battleship.actualCenter.x - battleshipActualCenterX) * shipDistConst);
              ship.translateY(-(app.ships.battleship.actualCenter.z - battleshipActualCenterZ) * shipDistConst);
              app.ships.battleship.actualCenter.x = battleshipActualCenterX;
              app.ships.battleship.actualCenter.z = battleshipActualCenterZ;
              app.ships.battleship.actualPosition.x = battleshipActualPositionX;
              app.ships.battleship.actualPosition.z = battleshipActualPositionZ;
              app.ships.battleship.realPosition.x = battleshipRealPositionX;
              app.ships.battleship.realPosition.z = battleshipRealPositionZ;
            }
          } else {
            //Horizontal
            app.ships.battleship.actualPosition.x -= ship.position.x / shipDistConst - app.ships.battleship.actualCenter.x;
            app.ships.battleship.actualPosition.z += ship.position.y / shipDistConst - app.ships.battleship.actualCenter.z;
            app.ships.battleship.actualCenter.x = ship.position.x / shipDistConst;
            app.ships.battleship.actualCenter.z = ship.position.y / shipDistConst;
            app.ships.battleship.realPosition.x = Math.round(6 - app.ships.battleship.actualPosition.x);
            app.ships.battleship.realPosition.z = Math.round(7 + app.ships.battleship.actualPosition.z);

            requiredPositionTrans.push(app.ships.battleship.realPosition.x.toString() + app.ships.battleship.realPosition.z.toString());
            requiredPositionTrans.push(app.ships.battleship.realPosition.x.toString() + (app.ships.battleship.realPosition.z + 1).toString());
            requiredPositionTrans.push(app.ships.battleship.realPosition.x.toString() + (app.ships.battleship.realPosition.z + 2).toString());
            requiredPositionTrans.push(app.ships.battleship.realPosition.x.toString() + (app.ships.battleship.realPosition.z + 3).toString());
            app.ships.shipsData.filter(ship => ship.type != boat.name).map(ship => ship.locations.map(loc => actualUsedPositionsTrans.push(loc)));

            if (actualUsedPositionsTrans.indexOf(requiredPositionTrans[0]) < 0 && actualUsedPositionsTrans.indexOf(requiredPositionTrans[1]) < 0 && actualUsedPositionsTrans.indexOf(requiredPositionTrans[2]) < 0 && actualUsedPositionsTrans.indexOf(requiredPositionTrans[3]) < 0) {
              app.ships.shipsData.map(ship => {
                if (ship.type == boat.name) {
                  ship.locations = requiredPositionTrans
                }
              });
            } else {
              ship.translateX(-(app.ships.battleship.actualCenter.x - battleshipActualCenterX) * shipDistConst);
              ship.translateY(-(app.ships.battleship.actualCenter.z - battleshipActualCenterZ) * shipDistConst);
              app.ships.battleship.actualCenter.x = battleshipActualCenterX;
              app.ships.battleship.actualCenter.z = battleshipActualCenterZ;
              app.ships.battleship.actualPosition.x = battleshipActualPositionX;
              app.ships.battleship.actualPosition.z = battleshipActualPositionZ;
              app.ships.battleship.realPosition.x = battleshipRealPositionX;
              app.ships.battleship.realPosition.z = battleshipRealPositionZ;
            }
          }
          break;

        case 'carrier':
          let carrierActualCenterX = app.ships.carrier.actualCenter.x;
          let carrierActualCenterZ = app.ships.carrier.actualCenter.z;
          let carrierActualPositionX = app.ships.carrier.actualPosition.x;
          let carrierActualPositionZ = app.ships.carrier.actualPosition.z;
          let carrierRealPositionX = app.ships.carrier.realPosition.x;
          let carrierRealPositionZ = app.ships.carrier.realPosition.z;

          if (boat.rotation.y == Math.PI) {
            //Vertical
            app.ships.carrier.actualPosition.x += ship.position.x / shipDistConst - app.ships.carrier.actualCenter.x;
            app.ships.carrier.actualPosition.z -= ship.position.z / shipDistConst - app.ships.carrier.actualCenter.z;
            app.ships.carrier.actualCenter.x = ship.position.x / shipDistConst;
            app.ships.carrier.actualCenter.z = ship.position.z / shipDistConst;
            app.ships.carrier.realPosition.x = Math.round(2 - app.ships.carrier.actualPosition.x);
            app.ships.carrier.realPosition.z = Math.round(9 + app.ships.carrier.actualPosition.z);

            requiredPositionTrans.push((app.ships.carrier.realPosition.x).toString() + app.ships.carrier.realPosition.z.toString());
            requiredPositionTrans.push((app.ships.carrier.realPosition.x + 1).toString() + app.ships.carrier.realPosition.z.toString());
            requiredPositionTrans.push((app.ships.carrier.realPosition.x + 2).toString() + app.ships.carrier.realPosition.z.toString());
            requiredPositionTrans.push((app.ships.carrier.realPosition.x + 3).toString() + app.ships.carrier.realPosition.z.toString());
            requiredPositionTrans.push((app.ships.carrier.realPosition.x + 4).toString() + app.ships.carrier.realPosition.z.toString());
            app.ships.shipsData.filter(ship => ship.type != boat.name).map(ship => ship.locations.map(loc => actualUsedPositionsTrans.push(loc)));

            if (actualUsedPositionsTrans.indexOf(requiredPositionTrans[0]) < 0 && actualUsedPositionsTrans.indexOf(requiredPositionTrans[1]) < 0 && actualUsedPositionsTrans.indexOf(requiredPositionTrans[2]) < 0 && actualUsedPositionsTrans.indexOf(requiredPositionTrans[3]) < 0 && actualUsedPositionsTrans.indexOf(requiredPositionTrans[4]) < 0) {
              app.ships.shipsData.map(ship => {if (ship.type == boat.name) {ship.locations = requiredPositionTrans}});
            } else {
              ship.translateX(-(app.ships.carrier.actualCenter.x - carrierActualCenterX) * shipDistConst);
              ship.translateZ(-(app.ships.carrier.actualCenter.z - carrierActualCenterZ) * shipDistConst);
              app.ships.carrier.actualCenter.x = carrierActualCenterX;
              app.ships.carrier.actualCenter.z = carrierActualCenterZ;
              app.ships.carrier.actualPosition.x = carrierActualPositionX;
              app.ships.carrier.actualPosition.z = carrierActualPositionZ;
              app.ships.carrier.realPosition.x = carrierRealPositionX;
              app.ships.carrier.realPosition.z = carrierRealPositionZ;
            }
          } else {
            //Horizontal
            app.ships.carrier.actualPosition.x += ship.position.z / shipDistConst - app.ships.carrier.actualCenter.z;
            app.ships.carrier.actualPosition.z += ship.position.x / shipDistConst - app.ships.carrier.actualCenter.x;
            app.ships.carrier.actualCenter.x = ship.position.x / shipDistConst;
            app.ships.carrier.actualCenter.z = ship.position.z / shipDistConst;
            app.ships.carrier.realPosition.x = Math.round(6 - app.ships.carrier.actualPosition.x);
            app.ships.carrier.realPosition.z = Math.round(9 + app.ships.carrier.actualPosition.z);

            requiredPositionTrans.push(app.ships.carrier.realPosition.x.toString() + app.ships.carrier.realPosition.z.toString());
            requiredPositionTrans.push(app.ships.carrier.realPosition.x.toString() + (app.ships.carrier.realPosition.z + 1).toString());
            requiredPositionTrans.push(app.ships.carrier.realPosition.x.toString() + (app.ships.carrier.realPosition.z + 2).toString());
            requiredPositionTrans.push(app.ships.carrier.realPosition.x.toString() + (app.ships.carrier.realPosition.z + 3).toString());
            requiredPositionTrans.push(app.ships.carrier.realPosition.x.toString() + (app.ships.carrier.realPosition.z + 4).toString());
            app.ships.shipsData.filter(ship => ship.type != boat.name).map(ship => ship.locations.map(loc => actualUsedPositionsTrans.push(loc)));

            if (actualUsedPositionsTrans.indexOf(requiredPositionTrans[0]) < 0 && actualUsedPositionsTrans.indexOf(requiredPositionTrans[1]) < 0 && actualUsedPositionsTrans.indexOf(requiredPositionTrans[2]) < 0 && actualUsedPositionsTrans.indexOf(requiredPositionTrans[3]) < 0 && actualUsedPositionsTrans.indexOf(requiredPositionTrans[4]) < 0) {
              app.ships.shipsData.map(ship => {
                if (ship.type == boat.name) {
                  ship.locations = requiredPositionTrans
                }
              });
            } else {
              ship.translateX(-(app.ships.carrier.actualCenter.x - carrierActualCenterX) * shipDistConst);
              ship.translateZ(-(app.ships.carrier.actualCenter.z - carrierActualCenterZ) * shipDistConst);
              app.ships.carrier.actualCenter.x = carrierActualCenterX;
              app.ships.carrier.actualCenter.z = carrierActualCenterZ;
              app.ships.carrier.actualPosition.x = carrierActualPositionX;
              app.ships.carrier.actualPosition.z = carrierActualPositionZ;
              app.ships.carrier.realPosition.x = carrierRealPositionX;
              app.ships.carrier.realPosition.z = carrierRealPositionZ;
            }
          }
          break;
      }
}


//Ships rotation
function shipsRotation () {
  if (boat != null && renderer1.domElement.style.cursor == 'pointer') {

    var requiredPosition = [];

    var actualUsedPositions = [];

    var rotationAvailable = false;

    switch (boat.name) {
    case 'patrol':
      if (boat.rotation.y == Math.PI * 0.5) {
        requiredPosition.push((app.ships.patrol.realPosition.x + 1).toString() + app.ships.patrol.realPosition.z.toString());
        requiredPosition.push((app.ships.patrol.realPosition.x + 1).toString() + (app.ships.patrol.realPosition.z + 1).toString());
        app.ships.shipsData.filter(ship => ship.type != boat.name).map(ship => ship.locations.map(loc => actualUsedPositions.push(loc)));

        if (actualUsedPositions.indexOf(requiredPosition[0]) < 0 && actualUsedPositions.indexOf(requiredPosition[1]) < 0) {
          app.ships.shipsData.map(ship => {if (ship.type == boat.name) {ship.locations = requiredPosition}});
          rotationAvailable = true;
        }

        if (app.ships.patrol.realPosition.z <= 8 && rotationAvailable) {
          boat.rotation.y = Math.PI;
          boat.position.x += (0.375 - updatedBoat.position.z / patrolDistConst + updatedBoat.position.x / patrolDistConst);
          boat.position.z += (0.375 - updatedBoat.position.z / patrolDistConst - updatedBoat.position.x / patrolDistConst);
          app.ships.patrol.realPosition.x++;
        }
      } else {
        requiredPosition.push((app.ships.patrol.realPosition.x - 1).toString() + app.ships.patrol.realPosition.z.toString());
        requiredPosition.push(app.ships.patrol.realPosition.x.toString() + app.ships.patrol.realPosition.z.toString());
        app.ships.shipsData.filter(ship => ship.type != boat.name).map(ship => ship.locations.map(loc => actualUsedPositions.push(loc)));

        if (actualUsedPositions.indexOf(requiredPosition[0]) < 0 && actualUsedPositions.indexOf(requiredPosition[1]) < 0) {
          app.ships.shipsData.map(ship => {if (ship.type == boat.name) {ship.locations = requiredPosition}});
          rotationAvailable = true;
        }

        if (app.ships.patrol.realPosition.x > 0 && rotationAvailable) {
          boat.rotation.y = Math.PI * 0.5;
          boat.position.x -= (0.375 - updatedBoat.position.z / patrolDistConst + updatedBoat.position.x / patrolDistConst);
          boat.position.z -= (0.375 - updatedBoat.position.z / patrolDistConst - updatedBoat.position.x / patrolDistConst);
          app.ships.patrol.realPosition.x--;
        }
      }
      break;

    case 'submarine':
      if (boat.rotation.y == 0) {
        requiredPosition.push((app.ships.submarine.realPosition.x - 2).toString() + app.ships.submarine.realPosition.z.toString());
        requiredPosition.push((app.ships.submarine.realPosition.x - 1).toString() + app.ships.submarine.realPosition.z.toString());
        requiredPosition.push(app.ships.submarine.realPosition.x.toString() + app.ships.submarine.realPosition.z.toString());
        app.ships.shipsData.filter(ship => ship.type != boat.name).map(ship => ship.locations.map(loc => actualUsedPositions.push(loc)));

        if (actualUsedPositions.indexOf(requiredPosition[0]) < 0 && actualUsedPositions.indexOf(requiredPosition[1]) < 0 && actualUsedPositions.indexOf(requiredPosition[2]) < 0) {
          app.ships.shipsData.map(ship => {if (ship.type == boat.name) {ship.locations = requiredPosition}});
          rotationAvailable = true;
        }

        if (app.ships.submarine.realPosition.x > 1 && rotationAvailable) {
          boat.rotation.y = Math.PI * -0.5;
          boat.position.x -= (1 - updatedBoat.position.y / submarineDistConst - updatedBoat.position.x / submarineDistConst);
          boat.position.z -= (1 - updatedBoat.position.y / submarineDistConst + updatedBoat.position.x / submarineDistConst);
          app.ships.submarine.realPosition.x -= 2;
        }
      } else {
        requiredPosition.push((app.ships.submarine.realPosition.x + 2).toString() + app.ships.submarine.realPosition.z.toString());
        requiredPosition.push((app.ships.submarine.realPosition.x + 2).toString() + (app.ships.submarine.realPosition.z + 1).toString());
        requiredPosition.push((app.ships.submarine.realPosition.x + 2).toString() + (app.ships.submarine.realPosition.z + 2).toString());
        app.ships.shipsData.filter(ship => ship.type != boat.name).map(ship => ship.locations.map(loc => actualUsedPositions.push(loc)));

        if (actualUsedPositions.indexOf(requiredPosition[0]) < 0 && actualUsedPositions.indexOf(requiredPosition[1]) < 0 && actualUsedPositions.indexOf(requiredPosition[2]) < 0) {
          app.ships.shipsData.map(ship => {if (ship.type == boat.name) {ship.locations = requiredPosition}});
          rotationAvailable = true;
        }

        if (app.ships.submarine.realPosition.z <= 7 && rotationAvailable) {
          boat.rotation.y = 0;
          boat.position.x += (1 - updatedBoat.position.y / submarineDistConst - updatedBoat.position.x / submarineDistConst);
          boat.position.z += (1 - updatedBoat.position.y / submarineDistConst + updatedBoat.position.x / submarineDistConst);
          app.ships.submarine.realPosition.x += 2;
        }
      }
      break;

    case 'destroyer':
      if (boat.rotation.y == Math.PI) {
        requiredPosition.push((app.ships.destroyer.realPosition.x - 2).toString() + app.ships.destroyer.realPosition.z.toString());
        requiredPosition.push((app.ships.destroyer.realPosition.x - 1).toString() + app.ships.destroyer.realPosition.z.toString());
        requiredPosition.push(app.ships.destroyer.realPosition.x.toString() + app.ships.destroyer.realPosition.z.toString());
        app.ships.shipsData.filter(ship => ship.type != boat.name).map(ship => ship.locations.map(loc => actualUsedPositions.push(loc)));

        if (actualUsedPositions.indexOf(requiredPosition[0]) < 0 && actualUsedPositions.indexOf(requiredPosition[1]) < 0 && actualUsedPositions.indexOf(requiredPosition[2]) < 0) {
          app.ships.shipsData.map(ship => {if (ship.type == boat.name) {ship.locations = requiredPosition}});
          rotationAvailable = true;
        }

        if (app.ships.destroyer.realPosition.x > 1 && rotationAvailable) {
          boat.rotation.y = Math.PI * 0.5;
          boat.position.x -= (0.8 + updatedBoat.position.y / destroyerDistConst + updatedBoat.position.x / destroyerDistConst);
          boat.position.z -= (0.8 + updatedBoat.position.y / destroyerDistConst - updatedBoat.position.x / destroyerDistConst);
          app.ships.destroyer.realPosition.x -= 2;
        }
      } else {
        requiredPosition.push((app.ships.destroyer.realPosition.x + 2).toString() + app.ships.destroyer.realPosition.z.toString());
        requiredPosition.push((app.ships.destroyer.realPosition.x + 2).toString() + (app.ships.destroyer.realPosition.z + 1).toString());
        requiredPosition.push((app.ships.destroyer.realPosition.x + 2).toString() + (app.ships.destroyer.realPosition.z + 2).toString());
        app.ships.shipsData.filter(ship => ship.type != boat.name).map(ship => ship.locations.map(loc => actualUsedPositions.push(loc)));

        if (actualUsedPositions.indexOf(requiredPosition[0]) < 0 && actualUsedPositions.indexOf(requiredPosition[1]) < 0 && actualUsedPositions.indexOf(requiredPosition[2]) < 0) {
          app.ships.shipsData.map(ship => {if (ship.type == boat.name) {ship.locations = requiredPosition}});
          rotationAvailable = true;
        }

        if (app.ships.destroyer.realPosition.z <= 7 && rotationAvailable) {
          boat.rotation.y = Math.PI;
          boat.position.x += (0.8 + updatedBoat.position.y / destroyerDistConst + updatedBoat.position.x / destroyerDistConst);
          boat.position.z += (0.8 + updatedBoat.position.y / destroyerDistConst - updatedBoat.position.x / destroyerDistConst);
          app.ships.destroyer.realPosition.x += 2;
        }
      }
      break;

    case 'battleship':
      if (boat.rotation.y == 0) {
        requiredPosition.push((app.ships.battleship.realPosition.x - 3).toString() + app.ships.battleship.realPosition.z.toString());
        requiredPosition.push((app.ships.battleship.realPosition.x - 2).toString() + app.ships.battleship.realPosition.z.toString());
        requiredPosition.push((app.ships.battleship.realPosition.x - 1).toString() + app.ships.battleship.realPosition.z.toString());
        requiredPosition.push(app.ships.battleship.realPosition.x.toString() + app.ships.battleship.realPosition.z.toString());
        app.ships.shipsData.filter(ship => ship.type != boat.name).map(ship => ship.locations.map(loc => actualUsedPositions.push(loc)));

        if (actualUsedPositions.indexOf(requiredPosition[0]) < 0 && actualUsedPositions.indexOf(requiredPosition[1]) < 0 && actualUsedPositions.indexOf(requiredPosition[2]) < 0 && actualUsedPositions.indexOf(requiredPosition[3]) < 0) {
          app.ships.shipsData.map(ship => {if (ship.type == boat.name) {ship.locations = requiredPosition}});
          rotationAvailable = true;
        }

        if (app.ships.battleship.realPosition.x > 2 && rotationAvailable) {
          boat.rotation.y = Math.PI * -0.5;
          boat.position.x -= (1.5 - updatedBoat.position.y / battleshipDistConst - updatedBoat.position.x / battleshipDistConst);
          boat.position.z -= (1.5 - updatedBoat.position.y / battleshipDistConst + updatedBoat.position.x / battleshipDistConst);
          app.ships.battleship.realPosition.x -= 3;
        }
      } else {
        requiredPosition.push((app.ships.battleship.realPosition.x + 3).toString() + app.ships.battleship.realPosition.z.toString());
        requiredPosition.push((app.ships.battleship.realPosition.x + 3).toString() + (app.ships.battleship.realPosition.z + 1).toString());
        requiredPosition.push((app.ships.battleship.realPosition.x + 3).toString() + (app.ships.battleship.realPosition.z + 2).toString());
        requiredPosition.push((app.ships.battleship.realPosition.x + 3).toString() + (app.ships.battleship.realPosition.z + 3).toString());
        app.ships.shipsData.filter(ship => ship.type != boat.name).map(ship => ship.locations.map(loc => actualUsedPositions.push(loc)));

        if (actualUsedPositions.indexOf(requiredPosition[0]) < 0 && actualUsedPositions.indexOf(requiredPosition[1]) < 0 && actualUsedPositions.indexOf(requiredPosition[2]) < 0 && actualUsedPositions.indexOf(requiredPosition[3]) < 0) {
          app.ships.shipsData.map(ship => {if (ship.type == boat.name) {ship.locations = requiredPosition}});
          rotationAvailable = true;
        }

        if (app.ships.battleship.realPosition.z <= 6 && rotationAvailable) {
          boat.rotation.y = 0;
          boat.position.x += (1.5 - updatedBoat.position.y / battleshipDistConst - updatedBoat.position.x / battleshipDistConst);
          boat.position.z += (1.5 - updatedBoat.position.y / battleshipDistConst + updatedBoat.position.x / battleshipDistConst);
          app.ships.battleship.realPosition.x += 3;
        }
      }
      break;

    case 'carrier':
      if (boat.rotation.y == Math.PI * -0.5) {
        requiredPosition.push((app.ships.carrier.realPosition.x - 4).toString() + app.ships.carrier.realPosition.z.toString());
        requiredPosition.push((app.ships.carrier.realPosition.x - 3).toString() + app.ships.carrier.realPosition.z.toString());
        requiredPosition.push((app.ships.carrier.realPosition.x - 2).toString() + app.ships.carrier.realPosition.z.toString());
        requiredPosition.push((app.ships.carrier.realPosition.x - 1).toString() + app.ships.carrier.realPosition.z.toString());
        requiredPosition.push(app.ships.carrier.realPosition.x.toString() + app.ships.carrier.realPosition.z.toString());
        app.ships.shipsData.filter(ship => ship.type != boat.name).map(ship => ship.locations.map(loc => actualUsedPositions.push(loc)));

        if (actualUsedPositions.indexOf(requiredPosition[0]) < 0 && actualUsedPositions.indexOf(requiredPosition[1]) < 0 && actualUsedPositions.indexOf(requiredPosition[2]) < 0 && actualUsedPositions.indexOf(requiredPosition[3]) < 0 && actualUsedPositions.indexOf(requiredPosition[4]) < 0) {
          app.ships.shipsData.map(ship => {if (ship.type == boat.name) {ship.locations = requiredPosition}});
          rotationAvailable = true;
        }

        if (app.ships.carrier.realPosition.x > 3 && rotationAvailable) {
          boat.rotation.y = Math.PI;
          boat.position.x -= (2 + updatedBoat.position.z / carrierDistConst - updatedBoat.position.x / carrierDistConst);
          boat.position.z -= (2 - updatedBoat.position.z / carrierDistConst - updatedBoat.position.x / carrierDistConst);
          app.ships.carrier.realPosition.x -= 4;
        }
      } else {
        requiredPosition.push((app.ships.carrier.realPosition.x + 4).toString() + app.ships.carrier.realPosition.z.toString());
        requiredPosition.push((app.ships.carrier.realPosition.x + 4).toString() + (app.ships.carrier.realPosition.z + 1).toString());
        requiredPosition.push((app.ships.carrier.realPosition.x + 4).toString() + (app.ships.carrier.realPosition.z + 2).toString());
        requiredPosition.push((app.ships.carrier.realPosition.x + 4).toString() + (app.ships.carrier.realPosition.z + 3).toString());
        requiredPosition.push((app.ships.carrier.realPosition.x + 4).toString() + (app.ships.carrier.realPosition.z + 4).toString());
        app.ships.shipsData.filter(ship => ship.type != boat.name).map(ship => ship.locations.map(loc => actualUsedPositions.push(loc)));

        if (actualUsedPositions.indexOf(requiredPosition[0]) < 0 && actualUsedPositions.indexOf(requiredPosition[1]) < 0 && actualUsedPositions.indexOf(requiredPosition[2]) < 0 && actualUsedPositions.indexOf(requiredPosition[3]) < 0 && actualUsedPositions.indexOf(requiredPosition[4]) < 0) {
          app.ships.shipsData.map(ship => {if (ship.type == boat.name) {ship.locations = requiredPosition}});
          rotationAvailable = true;
        }

        if (app.ships.carrier.realPosition.z <= 5 && rotationAvailable) {
          boat.rotation.y = Math.PI * -0.5;
          boat.position.x += (2 + updatedBoat.position.z / carrierDistConst - updatedBoat.position.x / carrierDistConst);
          boat.position.z += (2 - updatedBoat.position.z / carrierDistConst - updatedBoat.position.x / carrierDistConst);
          app.ships.carrier.realPosition.x += 4;
        }
      }
      break;
  }
  }
}


//On resize
function onResize () {
  camera1.aspect = window.innerWidth / window.innerHeight;

  camera1.updateProjectionMatrix();

  renderer1.setSize(window.innerWidth, window.innerHeight);
}


//On mouse move
function onMouseMove (event) {
  event.preventDefault();

  mouse1.x = (event.offsetX / renderer1.domElement.width) * 2 - 1;

  mouse1.y = -(event.offsetY  / (renderer1.domElement.height * 0.5)) * 2 + 1;
}


//Animate
function animate () {
  requestAnimationFrame(animate);

  render();
}


//Render
function render () {
  renderer1.render(scene1, camera1);
}


//Ships placed

//Init 2
function init2 () {

  //Scene
  scene2 = new THREE.Scene();

  scene2.position.x = -5;
  scene2.position.z= -5;


  //Camera
  camera2 = new THREE.PerspectiveCamera(45, window.innerWidth * 0.5 / window.innerHeight, 1, 125);
  camera2.position.set(-14, 9, 14);
  camera2.lookAt(scene2.position);


  //Ground
  var groundGeometry = new THREE.PlaneBufferGeometry(250, 250);
  var groundMaterial = new THREE.MeshStandardMaterial({
    color: 0X4D87BD,
    roughness: 1,
    metalness: 0
  });
  groundMaterial.map = null;
  var ground = new THREE.Mesh(groundGeometry, groundMaterial);

  ground.position.x = 5;
  ground.position.z = 5;

  ground.rotation.x = Math.PI * -0.5;
  scene2.add(ground);


  //Water
  var waterGeometry = new THREE.PlaneBufferGeometry(250, 250);

  water2 = new THREE.Water(waterGeometry, {
    color: params.color,
    scale: params.scale,
    flowDirection: new THREE.Vector2(params.flowX, params.flowY),
    textureWidth: 1024,
    textureHeight: 1024
  });

  water2.position.x = 5;
  water2.position.y = 0.001;
  water2.position.z = 5;

  water2.rotation.x = Math.PI * -0.5;

  scene2.add(water2);


  //Squares (selection - marks)
  var squaresGeometry = new THREE.PlaneBufferGeometry(1, 1);

  var idx = 0;

  for (let i = 0; i < 10; i++) {
    for (let y = 0; y < 10; y++) {

      let squaresMaterial = new THREE.MeshStandardMaterial({
        color: 0Xffffff,
        opacity: 0.6,
        transparent: true,
        roughness: 1,
        metalness: 0
      });

      var square = new THREE.Mesh(squaresGeometry, squaresMaterial);

      square.visible = false;
      square.position.x = 0.5 + i;
      square.position.y = 0.002;
      square.position.z = 0.5 + y;
      square.rotation.x = Math.PI * -0.5;

      square.Id = idx++;

      pos2.push(square);

      scene2.add(square);
    }
  }


  //Grid
  var size = 10;

  var divisions = 10;

  var gridHelper = new THREE.GridHelper(size, divisions, 0x000000, 0x000000);

  gridHelper.position.x = 5;
  gridHelper.position.y = 0.003;
  gridHelper.position.z = 5;

  scene2.add(gridHelper);


  //Ships
  var loader = new THREE.GLTFLoader();

  for (let i = 0; i < app.gameView.ships.length; i++) {

    let boat = app.gameView.ships[i].type;

    let loc = app.gameView.ships[i].locations;

    let orient = loc[0][0] == loc[1][0];

    let url = '3d/models/' + boat + '/scene.gltf';

    loader.load(url, function (gltf) {

      if (orient) {
        switch (boat) {
          case 'patrol':
            gltf.scene.scale.set(0.01, 0.01, 0.01);
            gltf.scene.rotation.y = Math.PI;
            gltf.scene.position.x = 0.5 + Number(loc[0][0]);
            gltf.scene.position.y = 0.2;
            gltf.scene.position.z = 0.875 + Number(loc[0][1]);
            break;

          case 'submarine':
            gltf.scene.scale.set(0.105, 0.105, 0.105);
            gltf.scene.position.x = 0.5 + Number(loc[0][0]);
            gltf.scene.position.y = 0;
            gltf.scene.position.z = 1.46 + Number(loc[0][1]);
            break;

          case 'destroyer':
            gltf.scene.scale.set(0.015, 0.015, 0.015);
            gltf.scene.rotation.y = Math.PI;
            gltf.scene.position.x = 0.5 + Number(loc[0][0]);
            gltf.scene.position.y = 0.25;
            gltf.scene.position.z = 1.3 + Number(loc[0][1]);
            break;

          case 'battleship':
            gltf.scene.scale.set(0.15, 0.15, 0.15);
            gltf.scene.position.x = 0.5 + Number(loc[0][0]);
            gltf.scene.position.y = 0.11;
            gltf.scene.position.z = 2 + Number(loc[0][1]);
            break;

          case 'carrier':
            gltf.scene.scale.set(0.02, 0.02, 0.02);
            gltf.scene.rotation.y = Math.PI * -0.5;
            gltf.scene.position.x = 0.5 + Number(loc[0][0]);
            gltf.scene.position.y = 0;
            gltf.scene.position.z = 2.48 + Number(loc[0][1]);
            break;
        }

        scene2.add(gltf.scene);
      } else {
        switch (boat) {
          case 'patrol':
            gltf.scene.scale.set(0.01, 0.01, 0.01);
            gltf.scene.rotation.y = Math.PI * 0.5;
            gltf.scene.position.x = 1.125 + Number(loc[0][0]);
            gltf.scene.position.y = 0.2;
            gltf.scene.position.z = 0.5 + Number(loc[0][1]);
            break;

          case 'submarine':
            gltf.scene.scale.set(0.105, 0.105, 0.105);
            gltf.scene.rotation.y = Math.PI * -0.5;
            gltf.scene.position.x = 1.54 + Number(loc[0][0]);
            gltf.scene.position.y = 0;
            gltf.scene.position.z = 0.5 + Number(loc[0][1]);
            break;

          case 'destroyer':
            gltf.scene.scale.set(0.015, 0.015, 0.015);
            gltf.scene.rotation.y = Math.PI * 0.5;
            gltf.scene.position.x = 1.7 + Number(loc[0][0]);
            gltf.scene.position.y = 0.25;
            gltf.scene.position.z = 0.5 + Number(loc[0][1]);
            break;

          case 'battleship':
            gltf.scene.scale.set(0.15, 0.15, 0.15);
            gltf.scene.rotation.y = Math.PI * -0.5;
            gltf.scene.position.x = 2 + Number(loc[0][0]);
            gltf.scene.position.y = 0.11;
            gltf.scene.position.z = 0.5 + Number(loc[0][1]);
            break;

          case 'carrier':
            gltf.scene.scale.set(0.02, 0.02, 0.02);
            gltf.scene.rotation.y = Math.PI;
            gltf.scene.position.x = 2.52 + Number(loc[0][0]);
            gltf.scene.position.y = 0;
            gltf.scene.position.z = 0.5 + Number(loc[0][1]);
            break;
        }

        scene2.add(gltf.scene);
      }
    }, (xhr) => xhr, (err) => console.error(err));
  }


  //Background
  var cubeTextureLoader = new THREE.CubeTextureLoader();

  cubeTextureLoader.setPath('3d/img/skyboxsun25deg/');

  var cubeTexture = cubeTextureLoader.load([
					"px.jpg", "nx.jpg",
					"py.jpg", "ny.jpg",
					"pz.jpg", "nz.jpg"
				]);

  scene2.background = cubeTexture;


  //Light
  var ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);

  scene2.add(ambientLight);

  var directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);

  directionalLight.position.set(-1, 102.25, 1);

  scene2.add(directionalLight);


  //Renderer
  renderer2 = new THREE.WebGLRenderer({
    antialias: false
  });

  renderer2.setSize(window.innerWidth * 0.5, window.innerHeight);

  renderer2.setPixelRatio(window.devicePixelRatio);

  myShipsGrid.appendChild(renderer2.domElement);


  //Camera controls
  var orbitControls = new THREE.OrbitControls(camera2, renderer2.domElement);

  orbitControls.minDistance = 8;
  orbitControls.maxDistance = 23;

  orbitControls.minPolarAngle = 0.7;
  orbitControls.maxPolarAngle = Math.PI / 2.3;


  //Events
  window.addEventListener('resize', onResize2, false);
}

//On resize 2
function onResize2 () {

  camera2.aspect = window.innerWidth * 0.5 / window.innerHeight;

  camera2.updateProjectionMatrix();

  renderer2.setSize(window.innerWidth * 0.5, window.innerHeight);
}


//Animate 2
function animate2 () {

  requestAnimationFrame(animate2);

  render2();
}


//Render 2
function render2 () {

  renderer2.render(scene2, camera2);
}


//Salvoes marks on grid
function salvoesMarks1 () {

  //Missed salvoes
  app.gameView.salvoes.forEach(salvo => {
        if (salvo.player.id == app.opponent.id) {
        salvo.locations.forEach(loc => {
          pos2[Number(loc)].visible = true;
          pos2[Number(loc)].material.color.setHex(0xffff00);
          });
        }
  });

  //Impacted salvoes
  app.gameView.salvoes.forEach(salvo => {
    if (salvo.player.id == app.opponent.id) {
      salvo.hits.forEach(loc => {
        pos2[Number(loc)].visible = true;
        pos2[Number(loc)].material.color.setHex(0xffa500);
      });
    }
  });

  //When ship sunked
  app.gameView.salvoes.forEach(salvo => {
        if (salvo.player.id == app.opponent.id) {
            salvo.sunkedShips.forEach(ship => {
                ship.locations.forEach(loc => {
                  pos2[Number(loc)].visible = true;
                  pos2[Number(loc)].material.color.setHex(0xff0000);
                })
            });
        }
  });
}