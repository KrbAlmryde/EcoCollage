var queue = d3_queue.queue()
var width  = window.innerWidth,
    height = window.innerHeight;

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
var controls;


function Start(){
    queue
        .defer(d3.json, "js/assets/blueIslandElevation.json")
        .defer(d3.tsv, "js/assets/baseElevation.tsv")
        .await(OnCreate)
}

function OnCreate(err, data, orig){
    console.log("ON CREATE!");
    if (err) console.error('Fuck something is wrong')

    ConfigComponents();
    GenerateGeomHiRes( data );
    // GenerateGeomLoRes( dataPrep(orig) );
}

function render() {
    controls.update();
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

function ConfigComponents() {
    renderer.setSize(width, height);
    renderer.setClearColor(rgbToHex(255,255,255))
    document.getElementById('webgl').appendChild(renderer.domElement);

    camera.position.set(0, -100, 30);
    controls = new THREE.TrackballControls(camera,renderer.domElement); {
        controls.rotateSpeed = 4.0;
        controls.zoomSpeed = 1.5;
        controls.panSpeed = 1.0;

        controls.noZoom = false;
        controls.noPan = false;

        controls.staticMoving = false;
        controls.dynamicDampingFactor = 0.3;

        controls.keys = [65, 83, 68];
        // controls.enabled = true;
    }

    scene.add(new THREE.AmbientLight(0xeeeeee));
}


function GenerateGeomHiRes(data) {
    // var flattend = dataPrep(data)

    var extents = d3.extent(data, d => +d.elevation);
    console.log(data, extents);

    var geometry = new THREE.PlaneGeometry(60, 60, 239, 239);
    console.log(geometry.vertices.length);
    for (var i = 0, l = geometry.vertices.length; i < l; i++) {
        geometry.vertices[i].z = +data[i].elevation - +extents[0];
    }

    // instantiate a loader
    var texture = new THREE.TextureLoader().load('js/assets/fullSizeBlueIsland.png');
    var material = new THREE.MeshPhongMaterial({ map: texture });
    var plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    render();
}

function GenerateGeomLoRes(data) {
    // var flattend = dataPrep(data)
    console.log(data);

    var geometry = new THREE.PlaneGeometry(60, 60, 23, 23);
    console.log(geometry.vertices.length);
    for (var i = 0, l = geometry.vertices.length; i < l; i++) {
        geometry.vertices[i].z = data[i];
        console.log(geometry.vertices[i].z);
    }

    // instantiate a loader
    var texture = new THREE.TextureLoader().load('js/assets/fullSizeBlueIsland.png');
    var material = new THREE.MeshPhongMaterial({ map: texture });
    var plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    render();
}


function dataPrep(data) {
    var dataArray = d3.range(0, 24).map(function(d) { return new Array(24) })
    var flattend = new Array(24*24);
    // console.log(d3.extent(data, d => +d.x ));  // missing an entire row
    // console.log(d3.extent(data, d => +d.y ));
    data.forEach(function(d) {
        console.log(+d.x, +d.y, +d.elevation);
        dataArray[+d.x][+d.y] = (+d.elevation-200) * 0.04;
    })

    var i = 0;
    d3.range(0,24).forEach(function(x) {
        d3.range(0,24).forEach(function(y) {

            flattend[i] = dataArray[x][y] ? dataArray[x][y] : 0;
            // flattend[i] ? flattend[i] : 200.00
            console.log(x,y, flattend[i] )
            i ++
        })
    })

    return flattend;
}

function rgbToHex(R,G,B){
    function toHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
    return "#" + toHex(R) + toHex(G) + toHex(B)
}
