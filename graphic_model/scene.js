"use strict";

// To store the scene graph, and elements usefull to rendering the scene
const sceneElements = {
    sceneGraph: null,
    camera: null,
    control: null,
    renderer: null,
};

helper.initEmptyScene(sceneElements); // initialize the empty scene
load3DObjects(sceneElements.sceneGraph); // add elements within the scene
requestAnimationFrame(computeFrame); // animate

// neutral talking animation
let neutral_talking_head = gsap.timeline({ repeat: -1, repeatDelay: 0 });
let neutral_talking_arms = gsap.timeline({ repeat: -1, repeatDelay: 0 });

// HANDLING EVENTS

// Event Listeners
window.addEventListener('resize', resizeWindow);

// To keep track of the keyboard - WASD
var keyD = false, keyA = false, keyS = false, keyW = false;
document.addEventListener('keydown', onDocumentKeyDown, false);
document.addEventListener('keyup', onDocumentKeyUp, false);
document.addEventListener('keypress', onDocumentKeyPress, false);

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

function onDocumentKeyPress(event) {

    // stop talking first (for walking in any direction)
    if (event.keyCode == 100 || event.keyCode == 115 || event.keyCode == 97 || event.keyCode == 119) {
        neutral_talking(false);
        gsap.to(head.rotation, { x: 0, duration: 0.3 });
        gsap.to(head.rotation, { z: 0, duration: 0.3 });
    }

    // and then walking body rotations (which depends on direction)
    switch (event.keyCode) {
        case 100: //d

            gsap.to(torso2.rotation, { z: -0.45, duration: 0.3 });
            gsap.to(torso3.rotation, { z: -0.03, duration: 0.3 });
            gsap.to(head.rotation, { y: Math.PI / 2, duration: 0.3 });
            gsap.to(arms.rotation, { y: Math.PI / 2, duration: 0.3 });

            break;

        case 115: //s

            gsap.to(torso2.rotation, { x: -0.45, duration: 0.3 });
            gsap.to(torso3.rotation, { x: -0.03, duration: 0.3 });

            break;

        case 97: //a

            gsap.to(torso2.rotation, { z: 0.45, duration: 0.3 });
            gsap.to(torso3.rotation, { z: 0.03, duration: 0.3 });
            gsap.to(head.rotation, { y: -Math.PI / 2, duration: 0.3 });
            gsap.to(arms.rotation, { y: -Math.PI / 2, duration: 0.3 });

            break;

        case 119: //w

            gsap.to(torso2.rotation, { x: 0.45, duration: 0.3 });
            gsap.to(torso3.rotation, { x: 0.03, duration: 0.3 });
            gsap.to(head.rotation, { y: Math.PI, duration: 0.3 });
            gsap.to(arms.rotation, { y: Math.PI, duration: 0.3 });

            break;

    }
}

function neutral_position() {

    gsap.to(torso2.rotation, { x: 0, duration: 0.3 });
    gsap.to(torso3.rotation, { x: 0, duration: 0.3 });
    gsap.to(torso2.rotation, { z: 0, duration: 0.3 });
    gsap.to(torso3.rotation, { z: 0, duration: 0.3 });
    gsap.to(head.rotation, { y: 0, duration: 0.3 });
    gsap.to(arms.rotation, { y: 0, duration: 0.3 });

    neutral_talking(true);

}

function neutral_talking(play) {

    const arm1 = sceneElements.sceneGraph.getObjectByName("arm1");
    const arm2 = sceneElements.sceneGraph.getObjectByName("arm2");

    const shoulder1 = sceneElements.sceneGraph.getObjectByName("shoulder1");
    const shoulder2 = sceneElements.sceneGraph.getObjectByName("shoulder2");

    // each time the function is called, the head swinging is slightly different (due to the random animation durations)
    // this talking is a timeline (see the definition of the neutral_talking_head variable)
    // this means these animations below will be played in sequence
    neutral_talking_head.to(head.rotation, { x: 0.1, duration: gsap.utils.random(0.25, 0.5, 0.05) });
    neutral_talking_head.to(head.rotation, { z: gsap.utils.random(0.05, 0.1, 0.01), duration: gsap.utils.random(0.25, 0.5, 0.05) });
    neutral_talking_head.to(head.rotation, { x: -0.1, duration: gsap.utils.random(0.25, 0.5, 0.05) });
    neutral_talking_head.to(head.rotation, { x: 0.1, duration: gsap.utils.random(0.25, 0.5, 0.05) });
    neutral_talking_head.to(head.rotation, { x: -0.1, duration: gsap.utils.random(0.25, 0.5, 0.05) });
    neutral_talking_head.to(head.rotation, { z: gsap.utils.random(-0.05, -0.1, 0.01), duration: gsap.utils.random(0.25, 0.5, 0.05) });
    neutral_talking_head.to(head.rotation, { x: 0.1, duration: gsap.utils.random(0.25, 0.5, 0.05) });
    neutral_talking_head.to(head.rotation, { x: -0.1, duration: gsap.utils.random(0.25, 0.5, 0.05) });
    neutral_talking_head.to(head.rotation, { z: 0, duration: gsap.utils.random(0.25, 0.5, 0.05) });

    // neutral_talking_arms.to(arm1.rotation, { x: 0.1, duration: 1 });
    // neutral_talking_arms.to(arm1.rotation, { x: -0.1, duration: 1 });

    if (play) {
        neutral_talking_head.play();
        neutral_talking_arms.play();
    }
    else {
        neutral_talking_head.pause();
        neutral_talking_arms.pause();
    }

}

//////////////////////////////////////////////////////////////////


// Create and insert in the scene graph the models of the 3D scene
function load3DObjects(sceneGraph) {

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
    // Creating the head
    // ************************** //
    const head = new THREE.Group();
    head.name = "head";
    const material_head1 = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const material_head2 = new THREE.MeshPhongMaterial({ color: 0x000000 });
    const material_eyes = new THREE.MeshPhongMaterial({ color: 0xc3be32 });
    const material_ears = new THREE.MeshPhongMaterial({ color: 0x8a8a8a });

    // Main head parts

    const geometry_head1 = new THREE.BoxGeometry(1.5, 1, 1.2);
    const head1 = new THREE.Mesh(geometry_head1, material_head1);
    head1.position.y = 1;
    // head1.castShadow = true;

    const geometry_head2 = new THREE.CylinderGeometry(0.6, 0.6, 1.2, 32);
    const head2 = new THREE.Mesh(geometry_head2, material_head1);
    head2.position.y = 1.5;
    head2.rotation.x = Math.PI / 2;
    head2.scale.set(1.25, 1, 0.5);
    // head2.castShadow = true;

    const head3 = new THREE.Mesh(geometry_head1, material_head2);
    head3.position.set(0, 1, 0.165);
    head3.scale.set(0.8, 0.8, 0.8);

    const head4 = new THREE.Mesh(geometry_head2, material_head2);
    head4.position.set(0, 1.4, 0.165);
    head4.rotation.x = Math.PI / 2;
    head4.scale.set(1, 0.8, 0.4);

    // Eyes

    const eyes = new THREE.Group();
    eyes.name = "eyes";

    const eye_geometry = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 32);
    const eye1 = new THREE.Mesh(eye_geometry, material_eyes);
    eye1.position.set(-0.25, 1, 0.61);
    eye1.rotation.x = Math.PI / 2;
    eye1.scale.set(0.5, 1, 0.8);

    const eye2 = new THREE.Mesh(eye_geometry, material_eyes);
    eye2.position.set(0.25, 1, 0.61);
    eye2.rotation.x = Math.PI / 2;
    eye2.scale.set(0.5, 1, 0.8);

    const eyebrow_geometry = new THREE.BoxGeometry(0.3, 0.07, 0.2);
    const eyebrow1 = new THREE.Mesh(eyebrow_geometry, material_head1);
    eyebrow1.position.set(-0.25, 1.35, 0.61);

    const eyebrow2 = new THREE.Mesh(eyebrow_geometry, material_head1);
    eyebrow2.position.set(0.25, 1.35, 0.61);

    eyes.add(eye1, eye2);
    eyes.add(eyebrow1, eyebrow2);

    // Antennas

    const antennas = new THREE.Group();

    const ear_geometry = new THREE.BoxGeometry(0.2, 0.7, 0.35);
    const ear1 = new THREE.Mesh(ear_geometry, material_ears);
    ear1.position.set(-0.85, 1.1, 0);
    const ear2 = new THREE.Mesh(ear_geometry, material_ears);
    ear2.position.set(0.85, 1.1, 0);

    antennas.add(ear1, ear2);

    const antenna_stick_geometry = new THREE.CylinderGeometry(0.05, 0.05, 0.5, 8);
    const antenna_point_geometry = new THREE.SphereGeometry(0.08);

    const antenna_stick1 = new THREE.Mesh(antenna_stick_geometry, material_head1);
    antenna_stick1.position.set(-0.85, 1.6, 0);
    const antenna_point1 = new THREE.Mesh(antenna_point_geometry, material_head1);
    antenna_point1.position.set(-0.85, 1.8, 0);

    const antenna1 = new THREE.Group();
    antenna1.name = "antenna1";
    antenna1.add(antenna_stick1, antenna_point1);

    const antenna_stick2 = new THREE.Mesh(antenna_stick_geometry, material_head1);
    antenna_stick2.position.set(0.85, 1.6, 0);
    const antenna_point2 = new THREE.Mesh(antenna_point_geometry, material_head1);
    antenna_point2.position.set(0.85, 1.8, 0);

    const antenna2 = new THREE.Group();
    antenna2.name = "antenna2";
    antenna2.add(antenna_stick2, antenna_point2);
    antennas.add(antenna1, antenna2);

    head.add(head1, head2, head3, head4);
    head.add(eyes);
    head.add(antennas);
    head.position.y = 2.7;
    head.scale.set(1.3, 1.3, 1.3);

    // ************************** //
    // Creating the torso
    // ************************** //
    const torso = new THREE.Group();
    torso.name = "torso";
    const material_torso = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const material_torso2 = new THREE.MeshPhongMaterial({ color: 0x8a8a8a });

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

    const arms = new THREE.Group();
    const arm1_group = new THREE.Group();
    const arm2_group = new THREE.Group();
    const forearm1_group = new THREE.Group();
    const forearm2_group = new THREE.Group();

    const shoulder_geometry = new THREE.SphereGeometry(0.2, 32, 16);
    const hand_and_elbow_geometry = new THREE.SphereGeometry(0.15, 32, 16);
    const arm_part_geometry = new THREE.CylinderGeometry(0.1, 0.1, 0.7, 8, 1);

    const shoulder1 = new THREE.Mesh(shoulder_geometry, material_torso2);
    shoulder1.position.set(3, 2, 0);
    shoulder1.name = "shoulder1";
    const shoulder2 = new THREE.Mesh(shoulder_geometry, material_torso2);
    shoulder2.position.set(3, 2, 0);
    shoulder2.name = "shoulder2";

    const arm1 = new THREE.Mesh(arm_part_geometry, material_torso);
    arm1.position.set(3, 1.587, 0);
    const arm2 = new THREE.Mesh(arm_part_geometry, material_torso);
    arm2.position.set(3, 1.587, 0);

    const elbow1 = new THREE.Mesh(hand_and_elbow_geometry, material_torso2);
    elbow1.position.set(3, 1.194, 0);
    const elbow2 = new THREE.Mesh(hand_and_elbow_geometry, material_torso2);
    elbow2.position.set(3, 1.194, 0);

    const forearm1 = new THREE.Mesh(arm_part_geometry, material_torso);
    forearm1.position.set(3, 0.872, 0);
    const forearm2 = new THREE.Mesh(arm_part_geometry, material_torso);
    forearm2.position.set(3, 0.872, 0);

    const hand1 = new THREE.Mesh(hand_and_elbow_geometry, material_torso2);
    hand1.position.set(3, 0.515, 0);
    const hand2 = new THREE.Mesh(hand_and_elbow_geometry, material_torso2);
    hand2.position.set(3, 0.515, 0);

    forearm1_group.add(forearm1, hand1);
    arm1_group.add(shoulder1, arm1, elbow1, forearm1, hand1);
    arm1_group.name = "arm1";
    arm1_group.translate(3, 2, 0);
    forearm1_group.name = "forearm1";
    arm1_group.position.set(-2.3, 0.4, 0);
    arm1_group.scale.set(1.2, 1.2, 1.2);

    forearm2_group.add(forearm2, hand2);
    arm2_group.add(shoulder2, arm2, elbow2, forearm2, hand2);
    arm2_group.name = "arm2";
    forearm2_group.name = "forearm2";
    arm2_group.position.set(-4.9, 0.4, 0);
    arm2_group.scale.set(1.2, 1.2, 1.2);

    arms.add(arm1_group, arm2_group);
    arms.name = "arms";

    torso.add(torso1);
    torso.add(torso2);
    torso.add(torso3);
    torso.add(arms);
    // torso.visible = false;

    robot.add(head);
    robot.add(torso);
    sceneGraph.add(robot);

}

// Displacement values
var delta = 0.01; // if you need it
var dispX = 0.08, dispZ = 0.08;

// CONTROLING THE ROBOT WITH THE KEYBOARD
const robot = sceneElements.sceneGraph.getObjectByName("robot");
const head = sceneElements.sceneGraph.getObjectByName("head");
const arms = sceneElements.sceneGraph.getObjectByName("arms");

const torso2 = sceneElements.sceneGraph.getObjectByName("torso2");
const torso3 = sceneElements.sceneGraph.getObjectByName("torso3");

let neutral_position_called = true;
neutral_talking(true);

function computeFrame(time) {

    if (keyD && robot.position.x < 5) {
        robot.translateX(dispX);
        neutral_position_called = false;
    }
    if (keyW && robot.position.z > -5) {
        robot.translateZ(-dispZ);
        neutral_position_called = false;
    }
    if (keyA && robot.position.x > -5) {
        robot.translateX(-dispX);
        neutral_position_called = false;
    }
    if (keyS && robot.position.z < 5) {
        robot.translateZ(dispZ);
        neutral_position_called = false;
    }
    if (!keyD && !keyW && !keyA && !keyS) {
        if (!neutral_position_called) {
            neutral_position();
            neutral_position_called = true;
        }
    }

    // Rendering
    helper.render(sceneElements);
    // Update control of the camera
    sceneElements.control.update();
    // Call for the next frame
    requestAnimationFrame(computeFrame);
}