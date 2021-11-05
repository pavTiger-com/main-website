import * as THREE from "./three.module.js";

import * as GRID from "./methods.js"

import { Water } from './three.js/examples/jsm/objects/Water.js';

let socket = io( "http://" + window.location.hostname + ":" + window.location.port );

let animation_frames = [];


function sleepFor(sleepDuration){
    var now = new Date().getTime();
    while(new Date().getTime() < now + sleepDuration){ 
        /* Do nothing */ 
    }
}


function httpGet( Url ) {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", Url, false ); // false for synchronous request
    xmlHttp.send( null );
    return JSON.parse( xmlHttp.responseText );
}


function pad(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
}


function hsl(h, s, l) {
    return (new THREE.Color("rgb(255, 0, 0)")).setHSL(h, s, l);
}


function loadAnimation( loader, scene, file_prefix, file_index, ) {
    // Load a glTF resource
    loader.load(
        // resource URL
        file_prefix + pad(file_index, 4) + ".glb",
        // called when the resource is loaded
        function ( gltf ) {
            // const params = {
            //     color: '#ffffff',
            //     scale: 100000,
            //     flowX: 0.1,
            //     flowY: 0.1
            // };

            // let water = new Water( gltf.scene.children[0].geometry, {
            //     color: params.color,
            //     scale: params.scale,
            //     flowDirection: new THREE.Vector2( params.flowX, params.flowY ),
            //     textureWidth: 1024,
            //     textureHeight: 1024
            // } );

            // let water = new Water(
            //     gltf.scene.children[0].geometry,
            //     {
            //         textureWidth: 512,
            //         textureHeight: 512,
            //         waterNormals: new THREE.TextureLoader().load( 'three.js/examples/textures/waternormals.jpg', function ( texture ) {

            //             texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

            //         } ),
            //         sunDirection: new THREE.Vector3(),
            //         sunColor: 0xffffff,
            //         waterColor: 0x001e0f,
            //         distortionScale: 3.7,s
            //         fog: scene.fog !== undefined
            //     }
            // );

            let geometry = gltf.scene.children[0].geometry;

            // Create the material
            const material = new THREE.MeshPhongMaterial({
                color: new THREE.Color(0, 1, 1),
                opacity: 0.5,
                transparent: true,
                emissive: new THREE.Color(0, 1, 1),
                wireframe: false,
            });
            let water = new THREE.Mesh( geometry, material );

            animation_frames.push( water );
            scene.add( animation_frames[file_index - 1] );

            // animation_frames[file_index - 1].scale.set(170, 170, 170);
            animation_frames[file_index - 1].scale.set(95, 95, 95);
            animation_frames[file_index - 1].rotation.set(-Math.PI / 2 - 0.0174533, -0.0174533, 0);
            animation_frames[file_index - 1].position.set(-7.5, -0.9, 4.5);
            animation_frames[file_index - 1].visible = false;
            // animation_frames[file_index - 1].material.color = '0xff9900';
            
            // console.log( animation_frames[file_index - 1] );

            for (let n = 0; n < animation_frames[file_index - 1].material.length; ++n) {
                animation_frames[file_index - 1].material[n] = material
            }

            if (file_index < 1000) {
                loadAnimation( loader, scene, file_prefix, file_index + 1 );
            }

        },
        // called while loading is progressing
        function ( xhr ) {

            if (xhr.loaded / xhr.total * 100 == 100) console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

        },
        // called when loading has errors
        function ( error ) {

            console.log( 'An error happened' );

        }
    );
}


window.onload = function() {
    let tmp = GRID.init(), scene = tmp[0], renderer = tmp[1], camera = tmp[2], controls = tmp[3], loader = tmp[4];

    let stats = GRID.initStats( Stats );


    loadAnimation( loader, scene, 'animations/long/fluid_mesh_', 1 );

    socket.on( "update", function( msg ) {
        console.log( msg );
    } );


    const FPS = 10;
    let lastTimestamp = 0;

    // Main loop
    let curr = 0;
    let GameLoop = function( timestamp ) {
        requestAnimationFrame( GameLoop );
        stats.begin();
        controls.update();

        // if (timestamp - lastTimestamp < 1000 / FPS) return;

        if (animation_frames.length > 300) {
            if (curr >= 999) {
                animation_frames[curr].visible = false;
                animation_frames[0].visible = true;
                curr = 0;
            } else {
                animation_frames[curr].visible = false;
                animation_frames[curr + 1].visible = true;
                curr++;
            }
        }

        renderer.render( scene, camera );
        stats.end();
    }
    GameLoop()
};
