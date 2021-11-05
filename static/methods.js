import * as THREE from "./three.module.js";

import { DDSLoader } from "./three.js/examples/jsm/loaders/DDSLoader.js";
import { GLTFLoader } from "./three.js/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "./three.js/examples/jsm/loaders/DRACOLoader.js";
import { OrbitControls } from "./three.js/examples/jsm/controls/OrbitControls.js";


function httpGet( Url ) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", Url, false ); // false for synchronous request
    xmlHttp.send( null );
    return JSON.parse( xmlHttp.responseText );
}


function sleep( ms ) {
    return new Promise( ( resolve ) => setTimeout( resolve, ms ) );
}


function initStats( Stats ) {
    var stats = new Stats();
    stats.setMode( 0 ); // 0: fps, 1: ms

    // Align top-left
    stats.domElement.style.position = "absolute";
    stats.domElement.style.left = "0px";
    stats.domElement.style.top = "0px";
    document.body.appendChild( stats.dom );
    return stats;
}


function loadAndAdd( loader, scene, file_name ) {
    // Load a glTF resource
    loader.load(
        // resource URL
        file_name,
        // called when the resource is loaded
        function ( gltf ) {

            scene.add( gltf.scene ); 
        
        },
        // called while loading is progressing
        function ( xhr ) {

            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

        },
        // called when loading has errors
        function ( error ) {

            console.log( 'An error happened' );

        }
    );
    
}


function init() {
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 20, window.innerWidth / window.innerHeight, 0.1, 1000 );

    var renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );

    document.body.appendChild( renderer.domElement );
    var controls = new OrbitControls( camera, renderer.domElement );
    controls.enableKeys = false;
    // controls.enabled = false;

    window.addEventListener("resize", function () {
        var width = window.innerWidth;
        var height = window.innerHeight;
        renderer.setSize( width, height );
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });

    const onProgress = function ( xhr ) {
        if ( xhr.lengthComputable ) {
            const percentComplete = xhr.loaded / xhr.total * 100;
            // TODO: create a loading screen
            console.log( Math.round(percentComplete) + "% downloaded" );
        }
    };

    const onError = function () { };

    const manager = new THREE.LoadingManager();
    manager.addHandler( /\.dds$/i, new DDSLoader() );

    // Instantiate a loader
    const loader = new GLTFLoader();

    // Optional: Provide a DRACOLoader instance to decode compressed mesh data
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/three.js/examples/js/libs/draco/');
    loader.setDRACOLoader( dracoLoader );

    // Load 3D model
    loadAndAdd(loader, scene, 'models/water_maze.glb');

    // Skybox
    const cubeTextureLoader = new THREE.CubeTextureLoader();
    cubeTextureLoader.setPath( 'three.js/examples/textures/cube/Park2/' );

    const cubeTexture = cubeTextureLoader.load( [
        "posx.jpg", "negx.jpg",
        "posy.jpg", "negy.jpg",
        "posz.jpg", "negz.jpg"
    ] );

    scene.background = cubeTexture;

    // light
    let directionalLight = new THREE.DirectionalLight( 0xFFFFFF, 1.5 );
    directionalLight.position.set( 20, 20, 20 );
    scene.add(directionalLight);

    directionalLight = new THREE.DirectionalLight( 0xFFFFFF, 1.5 );
    directionalLight.position.set( -20, -20, -20 );
    scene.add(directionalLight);

    let ambientLight = new THREE.AmbientLight( 0xFFFFFF, 2 );
    scene.add(ambientLight);

    camera.position.set( 0, 170, 0 );

    camera.rotation.y = 0;
    camera.rotation.x = 3.14 / 2;

    return [ scene, renderer, camera, controls, loader ];
}


export { initStats, sleep, init };
