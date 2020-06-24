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


var scene3, camera3, renderer3, water3, intersects2, INTERSECTED2;

var pos3 = [];

var mouse3 = new THREE.Vector2(1, 1);

var raycaster2 = new THREE.Raycaster();

var opponentShipsGrid = document.getElementById('opponent-ships-grid');


function init3() {

    //Scene
    scene3 = new THREE.Scene();

    scene3.position.x = -5;
    scene3.position.z= -5;


    //Camera
    camera3 = new THREE.PerspectiveCamera(45, window.innerWidth * 0.5 / window.innerHeight, 1, 125);
    camera3.position.set(-14, 9, 14);
    camera3.lookAt(scene3.position);


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
    scene3.add(ground);


    //Water
    var waterGeometry = new THREE.PlaneBufferGeometry(250, 250);

    water3 = new THREE.Water(waterGeometry, {
        color: params.color,
        scale: params.scale,
        flowDirection: new THREE.Vector2(params.flowX, params.flowY),
        textureWidth: 1024,
        textureHeight: 1024
    });

    water3.position.x = 5;
    water3.position.y = 0.001;
    water3.position.z = 5;

    water3.rotation.x = Math.PI * -0.5;

    scene3.add(water3);


    //Squares (selection - marks)
    var squaresGeometry = new THREE.PlaneBufferGeometry(1, 1);

    var idx = 0;

    for (let i = 0; i < 10; i++) {
        for (let y = 0; y < 10; y++) {

            let squaresMaterial = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                opacity: 0,
                transparent: true,
                roughness: 1,
                metalness: 0
            });

            var square = new THREE.Mesh(squaresGeometry, squaresMaterial);

            square.position.x = 0.5 + i;
            square.position.y = 0.002;
            square.position.z = 0.5 + y;
            square.rotation.x = Math.PI * -0.5;

            square.Id = idx++;

            pos3.push(square);

            scene3.add(square);
        }
    }


    //Grid
    var size = 10;

    var divisions = 10;

    var gridHelper = new THREE.GridHelper(size, divisions, 0x000000, 0x000000);

    gridHelper.position.x = 5;
    gridHelper.position.y = 0.003;
    gridHelper.position.z = 5;

    scene3.add(gridHelper);


    //Ships
    var loader = new THREE.GLTFLoader();

    if (app.sunkedShipsOpponent) {
        for (let i = 0; i < app.sunkedShipsOpponent.length; i++) {
            let boat = app.sunkedShipsOpponent[i].type;

            let loc = app.sunkedShipsOpponent[i].locations;

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

                    scene3.add(gltf.scene);
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

                    scene3.add(gltf.scene);
                }
            }, (xhr) => xhr, (err) => console.error(err));
        }
    }


    //Background
    var cubeTextureLoader = new THREE.CubeTextureLoader();

    cubeTextureLoader.setPath('3d/img/skyboxsun25deg/');

    var cubeTexture = cubeTextureLoader.load([
        "px.jpg", "nx.jpg",
        "py.jpg", "ny.jpg",
        "pz.jpg", "nz.jpg"
    ]);

    scene3.background = cubeTexture;


    //Light
    var ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);

    scene3.add(ambientLight);

    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);

    directionalLight.position.set(-1, 102.25, 1);

    scene3.add(directionalLight);


    //Renderer
    renderer3 = new THREE.WebGLRenderer({
        antialias: false
    });

    renderer3.setSize(window.innerWidth * 0.5, window.innerHeight);

    renderer3.setPixelRatio(window.devicePixelRatio);

    opponentShipsGrid.appendChild(renderer3.domElement);


    //Camera controls
    var orbitControls = new THREE.OrbitControls(camera3, renderer3.domElement);

    orbitControls.minDistance = 8;
    orbitControls.maxDistance = 23;

    orbitControls.minPolarAngle = 0.7;
    orbitControls.maxPolarAngle = Math.PI / 2.3;


    //Events
    window.addEventListener('resize', onResize3, false);

    opponentShipsGrid.addEventListener('mousemove', onMouseMove3, false);

    opponentShipsGrid.addEventListener('click', salvoesSelection, false);
}


function onResize3() {

    camera3.aspect = window.innerWidth * 0.5 / window.innerHeight;

    camera3.updateProjectionMatrix();

    renderer3.setSize(window.innerWidth * 0.5, window.innerHeight);
}


function onMouseMove3(event) {
    event.preventDefault();

    if (navigator.appVersion.indexOf('Mac') != -1) {
        mouse3.x = (event.offsetX / (renderer3.domElement.width * 0.5)) * 2 - 1;

        mouse3.y = -(event.offsetY / (renderer3.domElement.height * 0.5)) * 2 + 1;
    } else {
        mouse3.x = (event.offsetX / (renderer3.domElement.width * 0.8)) * 2 - 1;

        mouse3.y = -(event.offsetY / (renderer3.domElement.height * 0.8)) * 2 + 1;
    }
}


//Salvoes selection
function salvoesSelection() {
    if (app.gameView.state == 'PLACE_SALVOES') {
        if(INTERSECTED2 && INTERSECTED2.material.color.getHex() == '0xffffff' && app.salvoesSelected.length < 5 - app.sunkedShipsPlayer.length) {
            INTERSECTED2.material.color.setHex('0x00ff00');
            if(INTERSECTED2.Id < 10) {
                app.salvoesSelected.push('0' + INTERSECTED2.Id);
                if (app.salvoesSelected.length == 5 - app.sunkedShipsPlayer.length) {
                    app.salvoesButtonMessage = 'SHOOT SALVOES!';
                } else {
                    app.salvoesButtonMessage = 'PLACE ' + (5 - app.sunkedShipsPlayer.length - app.salvoesSelected.length).toString() + ' SALVOES';
                }
            }else {
                app.salvoesSelected.push(INTERSECTED2.Id.toString());
                if (app.salvoesSelected.length == 5 - app.sunkedShipsPlayer.length) {
                    app.salvoesButtonMessage = 'SHOOT SALVOES!';
                } else {
                    app.salvoesButtonMessage = 'PLACE ' + (5 - app.sunkedShipsPlayer.length - app.salvoesSelected.length).toString() + ' SALVOES';
                }
            }
        } else if(INTERSECTED2 && INTERSECTED2.material.color.getHex() == '0x00ff00') {
            INTERSECTED2.material.color.setHex('0xffffff');
            app.salvoesSelected.splice(app.salvoesSelected.indexOf(INTERSECTED2.Id), 1);
            app.salvoesButtonMessage = 'PLACE ' + (5 - app.sunkedShipsPlayer.length - app.salvoesSelected.length).toString() + ' SALVOES';
        }
    }
}


//Animate
function animate3() {

    requestAnimationFrame(animate3);

    render3();
}


//Render
function render3() {

    raycaster2.setFromCamera(mouse3, camera3);

    intersects2 = raycaster2.intersectObjects(pos3);

    if (intersects2.length > 0) {
      if (INTERSECTED2 != intersects2[0].object) {
        if (INTERSECTED2 && INTERSECTED2.material.color.getHex() != '0xffff00' && INTERSECTED2.material.color.getHex() != '0xffa500' && INTERSECTED2.material.color.getHex() != '0xff0000' && INTERSECTED2.material.color.getHex() != '0x00ff00'){
            INTERSECTED2.material.opacity = 0;
        }
        INTERSECTED2 = intersects2[0].object;
        INTERSECTED2.material.opacity = 0.6;
      }
    } else {
      if (INTERSECTED2 && INTERSECTED2.material.color.getHex() != '0xffff00' && INTERSECTED2.material.color.getHex() != '0xffa500' && INTERSECTED2.material.color.getHex() != '0xff0000' && INTERSECTED2.material.color.getHex() != '0x00ff00') {
          INTERSECTED2.material.opacity = 0;
      }
      INTERSECTED2 = null;
    }

    renderer3.render(scene3, camera3);
}


//Salvoes marks on grid
function salvoesMarks2() {

    //Missed salvoes
    app.gameView.salvoes.forEach(salvo => {
        if(salvo.player.id == app.player.id){
            salvo.locations.forEach(loc => {
                pos3[Number(loc)].material.opacity = 0.6;
                pos3[Number(loc)].material.color.setHex(0xffff00);
            });
        }
    });

    //Impacted salvoes
    app.gameView.salvoes.forEach(salvo => {
        if(salvo.player.id == app.player.id){
            salvo.hits.forEach(loc => {
                pos3[Number(loc)].material.opacity = 0.6;
                pos3[Number(loc)].material.color.setHex(0xffa500);
            });
        }
    });

    //When ship sunked
    app.gameView.salvoes.forEach(salvo => {
        if(salvo.player.id == app.player.id){
            salvo.sunkedShips.forEach(ship => {
                ship.locations.forEach(loc => {
                    pos3[Number(loc)].material.opacity = 0.6;
                    pos3[Number(loc)].material.color.setHex(0xff0000);
                })
            });
        }
    });
}


//Load opponent's sunked boats
function loadSunkedBoats() {
    var lastSunkedShipsOpponent = [];

    let playerSalvoes = app.gameView.salvoes.filter(salvo => salvo.player.id == app.player.id).sort((a, b) => a.turn - b.turn);

    if (playerSalvoes[playerSalvoes.length - 1]) {
        lastSunkedShipsOpponent = playerSalvoes[playerSalvoes.length - 1].sunkedShips;

        if (app.sunkedShipsOpponent.length != lastSunkedShipsOpponent.length) {
            let boatToLoad = lastSunkedShipsOpponent.filter(ship => ship.type != app.sunkedShipsOpponent.map(boat => boat.type));

            console.log(boatToLoad);

            var loader = new THREE.GLTFLoader();

            for (let i = 0; i < boatToLoad.length; i++) {
                let boat = boatToLoad[i].type;

                let loc = boatToLoad[i].locations;

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

                        scene3.add(gltf.scene);
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

                        scene3.add(gltf.scene);
                    }
                }, (xhr) => xhr, (err) => console.error(err));
            }

            app.sunkedShipsOpponent = lastSunkedShipsOpponent;
        }
    }
}

