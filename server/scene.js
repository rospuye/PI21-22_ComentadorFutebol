

// To store the scene graph, and elements usefull to rendering the scene
const sceneElements = {
    sceneGraph: null,
    camera: null,
    control: null,  // NEW
    renderer: null,
};

helper.initEmptyScene(sceneElements); // initialize the empty scene
load3DObjects(sceneElements.sceneGraph); // add elements within the scene
requestAnimationFrame(computeFrame); // animate

// HANDLING EVENTS

// Event Listeners
window.addEventListener('resize', resizeWindow);

//To keep track of the keyboard - WASD
var keyD = false, keyA = false, keyS = false, keyW = false;
document.addEventListener('keydown', onDocumentKeyDown, false);
document.addEventListener('keyup', onDocumentKeyUp, false);

// Update render image size and camera aspect when the window is resized
function resizeWindow(eventParam) {
    const width = window.innerWidth;
    const height = window.innerHeight;

    sceneElements.camera.aspect = width / height;
    sceneElements.camera.updateProjectionMatrix();

    sceneElements.renderer.setSize(width, height);
}

function onDocumentKeyDown(event) {
    switch (event.keyCode) {
        case 68: //d
            keyD = true;
            break;
        case 83: //s
            keyS = true;
            break;
        case 65: //a
            keyA = true;
            break;
        case 87: //w
            keyW = true;
            break;
    }
}
function onDocumentKeyUp(event) {
    switch (event.keyCode) {
        case 68: //d
            keyD = false;
            break;
        case 83: //s
            keyS = false;
            break;
        case 65: //a
            keyA = false;
            break;
        case 87: //w
            keyW = false;
            break;
    }
}

//////////////////////////////////////////////////////////////////


// Create and insert in the scene graph the models of the 3D scene
function load3DObjects(sceneGraph) {

    // ************************** //
    // Textures
    // ************************** //
    const textureLoader = new THREE.TextureLoader();
    const gradientTexture = textureLoader.load('5.jpg');

    // ************************** //
    // Create a ground plane
    // ************************** //
    const planeGeometry = new THREE.PlaneGeometry(15, 15);
    const planeMaterial = new THREE.MeshPhongMaterial({ color: 0x225e23, side: THREE.DoubleSide });
    const planeObject = new THREE.Mesh(planeGeometry, planeMaterial);
    sceneGraph.add(planeObject);

    // Change orientation of the plane using rotation
    planeObject.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
    // Set shadow property
    planeObject.receiveShadow = true;

    // ************************** //
    // CREATING THE ROBOT
    // ************************** //
    const robot = new THREE.Group();
    robot.name = "robot";

    // ************************** //
    // Creating the torso
    // ************************** //
    const torso = new THREE.Group();
    torso.name = "torso";
    const material_torso = new THREE.MeshToonMaterial();
    material_torso.gradientMap = gradientTexture;
    gradientTexture.minFilter = THREE.NearestFilter;
    gradientTexture.magFilter = THREE.NearestFilter;
    gradientTexture.generateMipmaps = false;
    // const material_torso = new THREE.MeshStandardMaterial({ color: 0xffffff });

    const geometry_torso1 = new THREE.CylinderGeometry(1.20, 1, 1.3, 32, 1);
    const torso1 = new THREE.Mesh(geometry_torso1, material_torso);
    torso1.name = "torso1";
    torso1.position.y = 2;
    torso1.castShadow = true;

    const geometry_torso2 = new THREE.SphereGeometry(1, 32, 16);
    const torso2 = new THREE.Mesh(geometry_torso2, material_torso);
    torso2.name = "torso2";
    torso2.position.y = 1.5;
    torso2.scale.y = 1.2;
    torso2.castShadow = true;

    const geometry_torso3 = new THREE.SphereGeometry(1, 32, 16);
    const torso3 = new THREE.Mesh(geometry_torso3, material_torso);
    torso3.name = "torso3";
    torso3.position.set(0, 2.66, 0);
    torso3.scale.set(1.2, 0.6, 1.2);
    torso3.castShadow = true;

    torso.add(torso1);
    torso.add(torso2);
    torso.add(torso3);

    // ... rest of body ...

    robot.add(torso);
    sceneGraph.add(robot);

}

// Displacement values
var delta = 0.1; // if you need it
var dispX = 0.08, dispZ = 0.08;

function computeFrame(time) {

    // CONTROLING THE CUBE WITH THE KEYBOARD
    const robot = sceneElements.sceneGraph.getObjectByName("robot");

    const torso1 = sceneElements.sceneGraph.getObjectByName("torso1");
    const torso2 = sceneElements.sceneGraph.getObjectByName("torso2");
    const torso3 = sceneElements.sceneGraph.getObjectByName("torso3");

    if (keyD && robot.position.x < 2.5) {
        robot.translateX(dispX);
    }
    if (keyW && robot.position.z > -2.5) {
        robot.translateZ(-dispZ);
    }
    if (keyA && robot.position.x > -2.5) {
        robot.translateX(-dispX);
    }
    if (keyS && robot.position.z < 2.5) {
        robot.translateZ(dispZ);
    }

    // Rendering
    helper.render(sceneElements);
    // Update control of the camera
    sceneElements.control.update();
    // Call for the next frame
    requestAnimationFrame(computeFrame);
}