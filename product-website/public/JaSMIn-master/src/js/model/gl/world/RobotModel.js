/**
 * The RobotModel class definition.
 *
 * @author Stefan Glaser
 */
class RobotModel
{
  /**
   * RobotModel Constructor
   *
   * @param {string} name the name of the agent model
   */
  constructor (name)
  {
    /**
     * The name of the robot model
     * @type {string}
     */
    this.name = name;

    /**
     * The robot object group
     * @type {!THREE.Object3D}
     */
    this.objGroup = new THREE.Object3D();
    this.objGroup.name = name;
    this.objGroup.visible = false;

    /**
     * A list of Object3D objects representing the joints
     * @type {!Array<!THREE.Object3D>}
     */
    this.jointGroups = [];

    /**
     * The list of team materials of this robot model
     * @type {!Array<!THREE.Material>}
     */
    this.teamMatList = [];
  }

  /**
   * Check if this robot model is valid
   * @return {boolean} true if the robot model is valid, false otherwise
   */
  isValid ()
  {
    return this.objGroup.children.length > 0;
  }

  /**
   * Set visibility of this robot models' objects.
   * @param {boolean} active true for visible, false for invisible
   * @return {void}
   */
  setActive (active)
  {
    if (this.objGroup.visible !== active) {
      this.objGroup.visible = active;
    }
  }

  /**
   * Check visibility of this robot models' objects.
   * @return {boolean} true for visible, false otherwise
   */
  isActive ()
  {
    return this.objGroup.visible;
  }

  /**
   * Update the joint objects and object settings according to the given angles and agent data.
   *
   * @param  {!Array<number> | !Float32Array} angles the angles of the current state
   * @param  {!Array<number> | !Float32Array} data the agent data of the current state
   * @param  {!Array<number> | !Float32Array=} nextAngles the angles of the next state
   * @param  {!Array<number> | !Float32Array=} nextData the agent data of the next state
   * @param  {number=} t the interpolation time
   * @return {void}
   */
  update (angles, data, nextAngles = undefined, nextData = undefined, t = 0)
  {
    let jointData = angles;
    let i;

    // Check if we need to interpolate
    if (nextAngles !== undefined && t > 0) {
      if (t >= 1) {
        jointData = nextAngles;
      } else {
        // Interpolate state variables
        jointData = [];
        i = Math.min(angles.length, nextAngles.length);

        while (i--) {
          jointData[i] = t * (nextAngles[i] - angles[i]) + angles[i];
        }
      }
    }

    // Apply joint angles to model
    i = Math.min(jointData.length, this.jointGroups.length);

    while (i--) {
      // Calculate quaternion from axis and angle
      this.jointGroups[i].setRotationFromAxisAngle(this.jointGroups[i].jointAxis, jointData[i]);
      this.jointGroups[i].updateMatrix();
    }

    // Call model data update
    this.updateData(data, nextData, t);
  }

  /**
   * Update agent specific settings based on agent data.
   *
   * @param  {!Array<number> | !Float32Array} data the agent data of the current state
   * @param  {!Array<number> | !Float32Array | undefined} nextData the agent data of the next state
   * @param  {number=} t the interpolation time
   * @return {void}
   */
  updateData (data, nextData, t)
  {
    // Does intentionally nothing...
  }

  /**
   * Set the team color of this robot model
   *
   * @param {!THREE.Color} color the new team color
   */
  setTeamColor (color)
  {
    let i = this.teamMatList.length;

    while (i--) {
      const mat = this.teamMatList[i];
      mat.color.copy(color);
      mat.needsUpdate = true;
    }
  }
}

export { RobotModel };
