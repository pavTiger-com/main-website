import * as THREE from "./three.module.js";

import * as GRID from "./methods.js"

let socket = io( "http://" + window.location.hostname + ":" + window.location.port );



function httpGet(Url) {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", Url, false ); // false for synchronous request
    xmlHttp.send( null );
    return JSON.parse( xmlHttp.responseText );
}


window.onload = function() {
    let tmp = GRID.init(), scene = tmp[0], renderer = tmp[1], camera = tmp[2], controls = tmp[3];

    let A = 1, B = 1, OLDX = 0, OLDY = 0, OLDZ = 0, last = 0;

    let stats = GRID.initStats(Stats);


    socket.on("update", function(msg) {
        if (msg[0] != undefined && msg[1] != undefined && msg[2] != undefined && msg[3] != undefined) {
            console.log(msg);

            const quaternion = new THREE.Quaternion(msg[0], msg[1], msg[2], msg[3]);
            window.pen.rotation.setFromQuaternion(quaternion);
        }
    });


    // Main loop
    let GameLoop = function() {
        requestAnimationFrame( GameLoop );
        stats.begin();
        controls.update();


        renderer.render( scene, camera );
        stats.end();
    }
    GameLoop()
};
