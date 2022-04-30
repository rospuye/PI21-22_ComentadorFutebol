import { ICameraController } from './ICameraController.js';
import { JsMath } from '../../utils/JsMath.js';

/**
 * The UniversalCameraController class definition.
 *
 * @author Stefan Glaser
 */
class UniversalCameraController extends ICameraController
{
  /**
   * Universal camera controller constructor
   *
   * @param {!THREE.PerspectiveCamera} camera the camera object
   * @param {!Element} canvas the monitor canvas
   */
  constructor (camera, canvas)
  {
    super();

    /**
     * The camera object.
     * @type {!THREE.PerspectiveCamera}
     */
    this.camera = camera;

    /**
     * The webgl renderer canvas object.
     * @type {!Element}
     */
    this.canvas = canvas;

    const scope = this;

    /**
     * The camera target position.
     * @type {!THREE.Vector3}
     */
    this.targetPos = new THREE.Vector3(0, 105, 0);

    /**
     * The camera target rotation.
     * @type {!THREE.Euler}
     */
    this.targetRot = new THREE.Euler(-Math.PI / 2, 0, 0, 'YXZ');
    this.targetRot.onChange(function() {
      scope.targetMatrix.makeRotationFromEuler(scope.targetRot);
    });

    /**
     * The camera target rotation as matrix.
     * A 3x3 Matrix would be enough, but the Matrix3 from threejs has only limited functionality.
     * @type {!THREE.Matrix4}
     */
    this.targetMatrix = new THREE.Matrix4();
    this.targetMatrix.makeRotationX(-Math.PI / 2);

    /**
     * The screen position where a rotation action was started, or null if no rotation action is active.
     * @type {?THREE.Vector2}
     */
    this.rotateStart = null;

    /**
     * The screen position where a pan action was started, or null if no pan action is active.
     * @type {?THREE.Vector2}
     */
    this.panStart = null;

    /**
     * The pan speed.
     * @type {number}
     */
    this.panSpeed = 1;

    /**
     * The screen position where a zoom action was started, or null if no zoom action is active.
     * @type {?THREE.Vector2}
     */
    this.zoomStart = null;

    /**
     * The current pan speed vector resulting from keyboard actions.
     * @type {!THREE.Vector3}
     */
    this.currentSpeed = new THREE.Vector3();

    /**
     * The intended pan speed vector resulting from keyboard actions.
     * @type {!THREE.Vector3}
     */
    this.intendedSpeed = new THREE.Vector3();

    // Klick indicator sphere
    const geometry = new THREE.SphereGeometry(0.05, 16, 16);
    const material = new THREE.MeshPhongMaterial({ color: 0xaaaa00 });

    /**
     * The click indicator sphere.
     * @type {!THREE.Mesh}
     */
    this.indicatorSphere = new THREE.Mesh(geometry, material);
    this.indicatorSphere.name = 'camControlIndicatorSphere';
    this.indicatorSphere.visible = false;

    /**
     * The click indicator sphere time to live.
     * @type {number}
     */
    this.indicatorTTL = 0;

    /**
     * The area of interest.
     * @type {!THREE.Vector2}
     */
    this.areaOfInterest = new THREE.Vector2(105, 68);

    /**
     * The camera controller bounds.
     * @type {!THREE.Vector3}
     */
    this.bounds = new THREE.Vector3(500, 500, 500);

    /**
     * Enable/Disable camera controller.
     * @type {boolean}
     */
    this.enabled = true;

    /**
     * The object to track or null if no object is currently tracked.
     * @type {?THREE.Object3D}
     */
    this.trackingObject = null;
  }

  /**
   * @override
   * @param {boolean} enabled
   */
  setEnabled (enabled)
  {
    if (this.enabled !== enabled) {
      this.enabled = enabled;

      if (!enabled) {
        this.rotateStart = null;
        this.panStart = null;
        this.zoomStart = null;
        this.intendedSpeed.setScalar(0);
      }
    }
  }

  /**
   * @override
   * @param {!THREE.Vector3} bounds
   */
  setBounds (bounds)
  {
    this.bounds.copy(bounds);

    // TODO: Clamp current camera position
  }

  /**
   * @override
   * @param {!THREE.Vector2} areaOfInterest
   */
  setAreaOfInterest (areaOfInterest)
  {
    this.areaOfInterest.copy(areaOfInterest);
  }

  /**
   * @override
   * @param  {number} deltaT
   */
  update (deltaT)
  {
    // Move camera according to speedVector
    this.currentSpeed.lerp(this.intendedSpeed, 0.1);

    if (this.currentSpeed.length() < 0.01) {
      this.currentSpeed.setScalar(0);
    } else {
      this.move(this.currentSpeed.x, this.currentSpeed.z, this.currentSpeed.y);
    }

    this.camera.position.copy(this.targetPos);

    if (this.trackingObject !== null) {
      this.camera.lookAt(this.trackingObject.position);
      this.targetRot.copy(this.camera.rotation);
    } else {
      this.camera.rotation.copy(this.targetRot);
    }

    if (this.indicatorSphere.visible && this.indicatorTTL-- < 0) {
      this.indicatorSphere.visible = false;
    }
  }

  /**
   * Track the given object.
   *
   * @param  {?THREE.Object3D} obj the object to track with the camera
   * @return {void}
   */
  trackObject (obj)
  {
    this.trackingObject = obj;
  }

  /**
   * Set the indicator sphere to a certain position and give it 10 cycles TTL.
   *
   * @param {!THREE.Vector3} pos the target position
   */
  setIndicator (pos)
  {
    this.indicatorSphere.position.copy(pos);
    this.indicatorSphere.visible = true;
    this.indicatorTTL = 10;
  }

  /**
   * [getCenterIntersectionPoint description]
   *
   * @param  {number} min the minimum distance
   * @param  {number} max the maximum distance
   * @return {{point: !THREE.Vector3, distance: number}}
   */
  getCenterIntersectionPoint (min, max)
  {
    let length = 0;
    const dirVec = new THREE.Vector3();
    dirVec.setFromMatrixColumn(this.targetMatrix, 2);
    dirVec.negate();

    if (dirVec.y < -0.01 || dirVec.y > 0.01) {
      dirVec.multiplyScalar(Math.abs(this.targetPos.y / dirVec.y));
      dirVec.clampLength(-max, max);
      length = dirVec.length();
    } else {
      // Calculate a point maxLength or 100 meter away from the view direction
      length = max;
      dirVec.multiplyScalar(max / dirVec.length());
    }

    dirVec.add(this.targetPos);

    this.setIndicator(dirVec);

  //    console.log('At Point: ' + dirVec.x + ' ' + dirVec.y + ' ' + dirVec.z);
    return { point: dirVec, distance: length };
  }

  /**
   * [getIntersectionPoint description]
   *
   * @param  {!THREE.Vector2} clickPos
   * @param  {number} min
   * @param  {number} max
   * @return {{point: !THREE.Vector3, distance: number}}
   */
  getIntersectionPoint (clickPos, min, max)
  {
    let length = 0;
    const fovMax = Math.tan((this.camera.fov / 2) * Math.PI / 180.0) * 2;

    const x = fovMax * clickPos.x / this.canvas.clientHeight;
    const y = fovMax * clickPos.y / this.canvas.clientHeight;

    const dirVec = new THREE.Vector3(x, y, -1);
    dirVec.applyMatrix4(this.targetMatrix);

    if (dirVec.y < -0.01 || dirVec.y > 0.01) {
      dirVec.multiplyScalar(-this.targetPos.y / dirVec.y);
      dirVec.clampLength(min, max);
      length = dirVec.length();
    } else {
      // Calculate a point max length meter away from the view direction
      length = max;
      dirVec.multiplyScalar(max / dirVec.length());
    }

    dirVec.add(this.targetPos);

    this.setIndicator(dirVec);

  //    console.log('At Point: ' + dirVec.x + ' ' + dirVec.y + ' ' + dirVec.z);
    return { point: dirVec, distance: length };
  }

  /**
   * Set the traget rotation in degrees.
   *
   * @param {number} horizontalAngle
   * @param {number} verticalAngle
   */
  setTargetRotDeg (horizontalAngle, verticalAngle)
  {
    this.setTargetRot(JsMath.toRad(horizontalAngle), JsMath.toRad(verticalAngle));
  }

  /**
   * Set the target rotation in radians.
   *
   * @param {number} horizontalAngle
   * @param {number} verticalAngle
   */
  setTargetRot (horizontalAngle, verticalAngle)
  {
    if (horizontalAngle > Math.PI) {
      horizontalAngle -= Math.PI * 2;
    } else if (horizontalAngle < -Math.PI) {
      horizontalAngle += Math.PI * 2;
    }

    this.targetRot.set(THREE.Math.clamp(verticalAngle, -Math.PI / 2, Math.PI / 2), horizontalAngle, 0);
  }

  /**
   * [shiftTargetRot description]
   *
   * @param  {number} horizontalShift
   * @param  {number} verticalshift
   * @return {void}
   */
  shiftTargetRot (horizontalShift, verticalshift)
  {
    this.setTargetRot(this.targetRot.y + horizontalShift, this.targetRot.x + verticalshift);
  }

  /**
   * Set the target position of the camera.
   *
   * @param {number} x
   * @param {number} y
   * @param {number} z
   */
  setTargetPos (x, y, z)
  {
    this.targetPos.x = x;
    this.targetPos.y = y;
    this.targetPos.z = z;
  }

  /**
   * Shift the target position of the camera.
   *
   * @param  {number} x
   * @param  {number} y
   * @param  {number} z
   * @return {void}
   */
  shiftTargetPos (x, y, z)
  {
    this.targetPos.x += x;
    this.targetPos.y += y;
    this.targetPos.z += z;
  }

  /**
   * Handle start rotation.
   *
   * @param  {!THREE.Vector2} pos
   * @return {void}
   */
  handleStartRotate (pos)
  {
    if (this.enabled) {
      this.rotateStart = new THREE.Vector2();
      this.rotateStart.copy(pos);
    }
  }

  /**
   * Handle start pan.
   *
   * @param {!THREE.Vector2} pos
   * @return {void}
   */
  handleStartPan (pos)
  {
    if (this.enabled) {
      this.panStart = new THREE.Vector2();
      this.panStart.copy(pos);

      const dist = this.getIntersectionPoint(pos, 0.5, 100).distance;
      this.panSpeed = dist * Math.tan((this.camera.fov / 2) * Math.PI / 180.0) * 2;
    }
  }

  /**
   * Handle start zoom.
   *
   * @param  {!THREE.Vector2} pos
   * @return {void}
   */
  handleStartZoom (pos)
  {
    if (this.enabled) {
      this.zoomStart = new THREE.Vector2();
      this.zoomStart.copy(pos);
    }
  }

  /**
   * Handle end rotate.
   *
   * @return {void}
   */
  handleEndRotate ()
  {
    this.rotateStart = null;
  }

  /**
   * Handle pan end.
   *
   * @return {void}
   */
  handleEndPan ()
  {
    this.panStart = null;
  }

  /**
   * Handle zoom end.
   *
   * @return {void}
   */
  handleEndZoom ()
  {
    this.zoomStart = null;
  }

  /**
   * Handle zoom end.
   *
   * @return {boolean}
   */
  isWaitingForMouseEvents ()
  {
    return this.rotateStart !== null || this.panStart !== null || this.zoomStart !== null;
  }

  /**
   * Handle rotation.
   *
   * @param  {!THREE.Vector2} pos
   * @return {void}
   */
  handleRotate (pos)
  {
    if (this.rotateStart === null) { return; }

    const deltaX = this.rotateStart.x - pos.x;
    const deltaY = pos.y - this.rotateStart.y;

    this.shiftTargetRot(Math.PI * deltaX / this.canvas.clientHeight,
                        Math.PI * deltaY / this.canvas.clientHeight);

    this.rotateStart.set(pos.x, pos.y);
  }

  /**
   * Handle pan.
   *
   * @param  {!THREE.Vector2} pos
   * @return {void}
   */
  handlePan (pos)
  {
    if (this.panStart === null) { return; }

    const deltaX = this.panStart.x - pos.x;
    const deltaY = this.panStart.y - pos.y;

    this.pan(this.panSpeed * deltaX / this.canvas.clientHeight,
             this.panSpeed * deltaY / this.canvas.clientHeight,
             0);

    this.panStart.set(pos.x, pos.y);
  }

  /**
   * Handle mouse zoom.
   *
   * @param  {!THREE.Vector2} pos
   * @return {void}
   */
  handleMouseZoom (pos)
  {
    if (this.zoomStart === null) { return; }

    // const deltaX = this.zoomStart.x - pos.x;
    const deltaY = this.zoomStart.y - pos.y;

    const dist = this.getCenterIntersectionPoint(1, 25).distance;
    const zoomSpeed = dist * Math.tan((this.camera.fov / 2) * Math.PI / 180.0) * 2;

    this.pan(0, 0, -5 * zoomSpeed * deltaY / this.canvas.clientHeight);

    this.zoomStart.set(pos.x, pos.y);
  }

  /**
   * Handle mouse wheel zoom.
   *
   * @param  {!THREE.Vector2} pos
   * @param  {number} amount
   * @return {void}
   */
  handleWheelZoom (pos, amount)
  {
    if (!this.enabled) { return; }

    let distance = 0.02 * amount * Math.abs(this.targetPos.y) / 30;

    if (distance < 0 && distance > -0.8) {
      distance = -0.8;
    } else if (distance > 0 && distance < 0.8) {
      distance = 0.8;
    }

    this.pan(0, 0, distance);
  }

  /**
   * Set a predefined cmaera pose.
   *
   * @param  {number=} id
   * @return {void}
   */
  setPredefinedPose (id)
  {
    if (!this.enabled) { return; }

    const length = this.areaOfInterest.x;
    const width = this.areaOfInterest.y;

    switch (id) {
      case 1:
        this.setTargetPos(-length * 0.8, length * 0.4, 0);
        this.setTargetRotDeg(-90, -35);
        break;
      case 2:
        this.setTargetPos(-length * 0.8, length * 0.4, width);
        this.setTargetRotDeg(-50, -30);
        break;
      case 3:
        this.setTargetPos(0, length * 0.4, width);
        this.setTargetRotDeg(35, -40);
        break;
      case 4:
        this.setTargetPos(0, length * 0.6, width * 1.1);
        this.setTargetRotDeg(0, -45);
        break;
      case 5:
        this.setTargetPos(0, length * 0.4, width);
        this.setTargetRotDeg(-35, -40);
        break;
      case 6:
        this.setTargetPos(length * 0.8, length * 0.4, width);
        this.setTargetRotDeg(50, -30);
        break;
      case 7:
        this.setTargetPos(length * 0.8, length * 0.4, 0);
        this.setTargetRotDeg(90, -35);
        break;
      case 0:
      default:
        this.setTargetPos(0, length, 0);
        this.setTargetRotDeg(0, -90);
        break;
    }
  }

  /**
   * Set a predefined cmaera pose.
   *
   * @return {void}
   */
  moveLeft ()
  {
    if (!this.enabled) { return; }

    const speed = this.areaOfInterest.x / 300;

    this.intendedSpeed.x = -speed;
    this.currentSpeed.x = -speed;
  }

  /**
   * Set a predefined cmaera pose.
   *
   * @return {void}
   */
  moveRight ()
  {
    if (!this.enabled) { return; }

    const speed = this.areaOfInterest.x / 300;

    this.intendedSpeed.x = speed;
    this.currentSpeed.x = speed;
  }

  /**
   * Set a predefined cmaera pose.
   *
   * @return {void}
   */
  moveForward ()
  {
    if (!this.enabled) { return; }

    const speed = this.areaOfInterest.x / 300;

    this.intendedSpeed.z = -speed;
    this.currentSpeed.z = -speed;
  }

  /**
   * Set a predefined cmaera pose.
   *
   * @return {void}
   */
  moveBack ()
  {
    if (!this.enabled) { return; }

    const speed = this.areaOfInterest.x / 300;

    this.intendedSpeed.z = speed;
    this.currentSpeed.z = speed;
  }

  /**
   * Set a predefined cmaera pose.
   *
   * @return {void}
   */
  moveUp ()
  {
    if (!this.enabled) { return; }

    const speed = this.areaOfInterest.x / 300;

    this.intendedSpeed.y = speed;
    this.currentSpeed.y = speed;
  }

  /**
   * Set a predefined cmaera pose.
   *
   * @return {void}
   */
  moveDown ()
  {
    if (!this.enabled) { return; }

    const speed = this.areaOfInterest.x / 300;

    this.intendedSpeed.y = -speed;
    this.currentSpeed.y = -speed;
  }

  /**
   * Set a predefined cmaera pose.
   *
   * @return {void}
   */
  stopMoveLeftRight ()
  {
    this.intendedSpeed.x = 0;
  }

  /**
   * Set a predefined cmaera pose.
   *
   * @return {void}
   */
  stopMoveForwardBack ()
  {
    this.intendedSpeed.z = 0;
  }

  /**
   * Set a predefined cmaera pose.
   *
   * @return {void}
   */
  stopMoveUpDown ()
  {
    this.intendedSpeed.y = 0;
  }

  /**
   * Perform pan.
   *
   * @param {number} panRight
   * @param {number} panUp
   * @param {number} panIn
   * @return {void}
   */
  pan (panRight, panUp, panIn)
  {
    const v = new THREE.Vector3();
    const t = new THREE.Vector3();

    v.setFromMatrixColumn(this.targetMatrix, 0);
    v.multiplyScalar(panRight);
    t.setFromMatrixColumn(this.targetMatrix, 1);
    t.multiplyScalar(panUp);
    v.add(t);
    t.setFromMatrixColumn(this.targetMatrix, 2);
    t.multiplyScalar(panIn);
    v.sub(t);

    this.shiftTargetPos(v.x, v.y, v.z);
  }

  /**
   * Perform move.
   *
   * @param {number} moveRight
   * @param {number} moveIn
   * @param {number} moveUp
   * @return {void}
   */
  move (moveRight, moveIn, moveUp)
  {
    const v = new THREE.Vector3();
    const t = new THREE.Vector3();

    v.setFromMatrixColumn(this.targetMatrix, 0);
    v.multiplyScalar(moveRight);
    t.setFromMatrixColumn(this.targetMatrix, 2);
    if (t.y < -0.99 || t.y > 0.99) {
      t.setFromMatrixColumn(this.targetMatrix, 1);
      t.negate();
    }
    t.y = 0;
    t.normalize();
    t.multiplyScalar(moveIn);
    v.add(t);

    this.shiftTargetPos(v.x, moveUp, v.z);
  }
}

export { UniversalCameraController };
