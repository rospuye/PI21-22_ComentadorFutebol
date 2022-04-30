/**
 * The ICameraController interface definition.
 *
 * @author Stefan Glaser
 */
class ICameraController
{
  /**
   * Enable/Disable the camera controller.
   *
   * @param {boolean} enabled true to enable the camera controller, false for disabling
   */
  setEnabled (enabled) {}

  /**
   * Set the bounds of the camera controller.
   *
   * @param  {!THREE.Vector3} bounds the new world bounds
   * @return {void}
   */
  setBounds (bounds) {}

  /**
   * Set the area of interest (+/- dimensions around the origin).
   *
   * @param  {!THREE.Vector2} areaOfInterest the area of interest
   * @return {void}
   */
  setAreaOfInterest (areaOfInterest) {}

  /**
   * Update the camera controller.
   * The update is needed for keyboard movements, as well for tracking objects.
   *
   * @param  {number} deltaT the time since the last render call
   * @return {void}
   */
  update (deltaT) {}
}

export { ICameraController };
