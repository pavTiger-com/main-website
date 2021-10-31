import * as THREE from "./three.module.js";

import { DDSLoader } from "./three.js/examples/jsm/loaders/DDSLoader.js";
import { GLTFLoader } from "./three.js/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "./three.js/examples/jsm/loaders/DRACOLoader.js";
import { OrbitControls } from "./three.js/examples/jsm/controls/OrbitControls.js";


function httpGet(Url) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", Url, false); // false for synchronous request
    xmlHttp.send(null);
    return JSON.parse(xmlHttp.responseText);
}


function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}


function initStats(Stats) {
    var stats = new Stats();
    stats.setMode(0); // 0: fps, 1: ms

    // Align top-left
    stats.domElement.style.position = "absolute";
    stats.domElement.style.left = "0px";
    stats.domElement.style.top = "0px";
    document.body.appendChild( stats.dom );
    return stats;
}


function init() {
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    var renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );

    document.body.appendChild( renderer.domElement );
    var controls = new OrbitControls( camera, renderer.domElement );
    controls.enableKeys = false;
    controls.enabled = false;

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

    var GLBFile = 'models/water_maze.glb';
    var JPGFile = 'models/grunge.jpg';

    // Instantiate a loader
    const loader = new GLTFLoader();

    // Optional: Provide a DRACOLoader instance to decode compressed mesh data
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/three.js/examples/js/libs/draco/');
    loader.setDRACOLoader( dracoLoader );

    // Load a glTF resource
    loader.load(
        // resource URL
        GLBFile,
        // called when the resource is loaded
        function ( gltf ) {

            scene.add( gltf.scene );

            gltf.animations; // Array<THREE.AnimationClip>
            gltf.scene; // THREE.Group
            gltf.scenes; // Array<THREE.Group>
            gltf.cameras; // Array<THREE.Camera>
            gltf.asset; // Object

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

    // light
    var directionalLight = new THREE.DirectionalLight( 0xFFFFFF, 1 );
    directionalLight.position.set( 6, 8, 8 );
    scene.add(directionalLight);

    directionalLight = new THREE.DirectionalLight( 0xFFFFFF, 1 );
    directionalLight.position.set( -6, -8, -8 );
    scene.add(directionalLight);

    var ambientLight = new THREE.AmbientLight( 0xFFFFFF, 0.7 );
    scene.add(ambientLight);

    camera.position.set( 0, 50, 0 );

    camera.rotation.y = 0;
    camera.rotation.x = 3.14 / 2;

    return [ scene, renderer, camera, controls ];
}


export { initStats, sleep, init };
