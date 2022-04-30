import { FPSMeter } from '../../utils/FPSMeter.js';
import { GLInfoBoard } from './GLInfoBoard.js';
import { ICameraController } from './ICameraController.js';

/**
 * The GLPanel class definition.
 *
 * @author Stefan Glaser
 */
class GLPanel
{
  /**
   * GLPanel Constructor
   *
   * @param {!Element} container the gl panel root dom element
   */
  constructor (container)
  {
    // Fetch initial container dimensions
    const width = container.clientWidth;
    const height = container.clientHeight;

    /**
     * The render interval.
     * 1 --> the scene is rendered every cycle
     * 2 --> the scene is rendered every second cycle
     * 3 --> the scene is rendered every third cycle
     * etc.
     *
     * @type {number}
     */
    this.renderInterval = 1;

    /**
     * The number of render cycles befor the next scene rendering.
     * @type {number}
     */
    this.renderTTL = 1;

    /**
     * The time passed since the last render call.
     * @type {number}
     */
    this.timeSinceLastRenderCall = 0;

    /**
     * The Camera instance.
     * @type {!THREE.PerspectiveCamera}
     */
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000);
    this.camera.position.set(20, 15, 15);
    this.camera.lookAt(new THREE.Vector3());
    this.camera.updateMatrix();

    /**
     * The WebGLRenderer instance from threejs.
     * @type {!THREE.WebGLRenderer}
     */
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    container.appendChild(this.renderer.domElement);

    /**
     * The Scene instance to render.
     * @type {?THREE.Scene}
     */
    this.scene = null;

    /**
     * The camera controller.
     * @type {?ICameraController}
     */
    this.cameraController = null;

    /**
     * The clock used to measure render times.
     * @type {!THREE.Clock}
     */
    this.clock = new THREE.Clock(true);

    /**
     * A helper util for monitoring the fps of the monitor.
     * @type {!FPSMeter}
     */
    this.fpsMeter = new FPSMeter(10);

    /**
     * The gl info board.
     * @type {!GLInfoBoard}
     */
    this.glInfoBoard = new GLInfoBoard(this.fpsMeter);
    this.glInfoBoard.setVisible(false);
    container.appendChild(this.glInfoBoard.domElement);

    /**
     * A listener to notify when a render cycle was triggered.
     * @type {(!Function | undefined)}
     */
    this.onNewRenderCycle = undefined;

    /**
     * The render function bound to this monitor instance.
     * @type {!Function}
     */
    this.renderFunction = this.render.bind(this);


    // Start animation
    requestAnimationFrame(this.renderFunction);
  }

  /**
   * The central gl render function.
   *
   * @return {void}
   */
  render ()
  {
    // Kepp render look alive
    requestAnimationFrame(this.renderFunction);

    // Fetch delta time sine last render call
    this.timeSinceLastRenderCall = this.clock.getDelta();

    // Print poor FPS info
    if (this.timeSinceLastRenderCall > 0.5) {
      console.log('LAAAAG: ' + this.timeSinceLastRenderCall);
    }

    // Update fps-meter
    this.fpsMeter.update(this.clock.elapsedTime);

    // Check for render interval
    if (--this.renderTTL > 0) {
      return;
    } else {
      this.renderTTL = this.renderInterval;
    }

    // Notify camera controller and render listener if present
    if (this.onNewRenderCycle !== undefined) {
      this.onNewRenderCycle(this.timeSinceLastRenderCall);
    }
    if (this.cameraController !== null) {
      this.cameraController.update(this.timeSinceLastRenderCall);
    }

    // Render scene is present
    if (this.scene !== null) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  /**
   * Automatically resize the gl canvas to fit its container.
   *
   * @return {void}
   */
  autoResize ()
  {
    const container = this.renderer.domElement.parentNode;

    this.setDimensions(container.clientWidth, container.clientHeight);
  }

  /**
   * Set the gl canvas dimensions.
   *
   * @param {number} width the canvas width
   * @param {number} height the canvas height
   */
  setDimensions (width, height)
  {
    // Directly return if size hasn't changed
    const size = this.renderer.getSize();
    if (size.width === width && size.height === height) {
      return;
    }

    // Update renderer size
    this.renderer.setSize(width, height);

    // Update camera parameters
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    // Render as soon as possible
    this.renderTTL = 0;
  }
}

export { GLPanel };
