/**
 * Indices in the object state array.
 * @enum {number}
 */
const OSIndices = {
  X_POS: 0,
  Y_POS: 1,
  Z_POS: 2,
  X_QUAT: 3,
  Y_QUAT: 4,
  Z_QUAT: 5,
  W_QUAT: 6
};



/**
 * The ObjectState class definition.
 *
 * This basic ObjectState provides information about the object's position and orientation at a specific point in time.
 *
 * @author Stefan Glaser
 */
class ObjectState
{
  /**
   * ObjectState Constructor
   * Create a new ObjectState with the given state information.
   *
   * @param {!Array<number> |
   *         !Float32Array |
   *         {
   *           x: number,
   *           y: number,
   *           z: number,
   *           qx: number,
   *           qy: number,
   *           qz: number,
   *           qw: number
   *         }=} params the object state information vector
   */
  constructor (params = undefined)
  {
    /**
     * The generic state array of the object.
     * @type {!Array<number> | !Float32Array}
     */
    this.state = [];

    // Initialize unit quaternion if no state information was passed
    if (params === undefined) {
      this.state = ObjectState.encodeObjectState(0, 0, 0, 0, 0, 0, 1);
    } else if (params instanceof Float32Array || params instanceof Array) {
      this.state = params;
    } else {
      this.state = ObjectState.encodeObjectState(params.x, params.y, params.z, params.qx, params.qy, params.qz, params.qw);
    }
  }

  /**
   * Retrieve the x position of the object.
   * @return {number} the x-position
   */
  get x ()
  {
    return this.state[OSIndices.X_POS] || 0;
  }

  /**
   * Set the x position of the object.
   * @param {number} x the new x position value
   * @return {void}
   */
  set x (x)
  {
    this.state[OSIndices.X_POS] = x;
  }

  /**
   * Retrieve the y position of the object.
   * @return {number} the y-position
   */
  get y ()
  {
    return this.state[OSIndices.Y_POS] || 0;
  }

  /**
   * Set the y position of the object.
   * @param {number} y the new y position value
   * @return {void}
   */
  set y (y)
  {
    this.state[OSIndices.Y_POS] = y;
  }

  /**
   * Retrieve the z position of the object.
   * @return {number} the z-position
   */
  get z ()
  {
    return this.state[OSIndices.Z_POS] || 0;
  }

  /**
   * Set the z position of the object.
   * @param {number} z the new z position value
   * @return {void}
   */
  set z (z)
  {
    this.state[OSIndices.Z_POS] = z;
  }

  /**
   * Retrieve the the x-term of the orientation quaternion vector of the object.
   * @return {number} the x-term of the quaternion vector
   */
  get qx ()
  {
    return this.state[OSIndices.X_QUAT] || 0;
  }

  /**
   * Set the the x-term of the orientation quaternion vector of the object.
   * @param {number} qx the x-term of the quaternion vector
   * @return {void}
   */
  set qx (qx)
  {
    this.state[OSIndices.X_QUAT] = qx;
  }

  /**
   * Retrieve the the y-term of the orientation quaternion vector of the object.
   * @return {number} the y-term of the quaternion vector
   */
  get qy ()
  {
    return this.state[OSIndices.Y_QUAT] || 0;
  }

  /**
   * Set the the y-term of the orientation quaternion vector of the object.
   * @param {number} qy the y-term of the quaternion vector
   * @return {void}
   */
  set qy (qy)
  {
    this.state[OSIndices.Y_QUAT] = qy;
  }

  /**
   * Retrieve the the z-term of the orientation quaternion vector of the object.
   * @return {number} the z-term of the quaternion vector
   */
  get qz ()
  {
    return this.state[OSIndices.Z_QUAT] || 0;
  }

  /**
   * Set the the z-term of the orientation quaternion vector of the object.
   * @param {number} qz the z-term of the quaternion vector
   * @return {void}
   */
  set qz (qz)
  {
    this.state[OSIndices.Z_QUAT] = qz;
  }

  /**
   * Retrieve the the scalar term of the orientation quaternion of the object.
   * @return {number} the scalar term of the quaternion
   */
  get qw ()
  {
    return this.state[OSIndices.W_QUAT] !== undefined ? this.state[OSIndices.W_QUAT] : 1;
  }

  /**
   * Set the the scalar term of the orientation quaternion of the object.
   * @param {number} qw the scalar term of the quaternion
   * @return {void}
   */
  set qw (qw)
  {
    this.state[OSIndices.W_QUAT] = qw;
  }

  /**
   * Retrieve the position of the object.
   * @return {!THREE.Vector3} the position vector
   */
  get position ()
  {
    const stateInfo = this.state;
    return new THREE.Vector3(stateInfo[OSIndices.X_POS] || 0, stateInfo[OSIndices.Y_POS] || 0, stateInfo[OSIndices.Z_POS] || 0);
  }

  /**
   * Set the position of the object.
   * @param {!THREE.Vector3} pos the position vector
   * @return {void}
   */
  set position (pos)
  {
    this.state[OSIndices.X_POS] = pos.x;
    this.state[OSIndices.Y_POS] = pos.y;
    this.state[OSIndices.Z_POS] = pos.z;
  }

  /**
   * Retrieve the orientation of the object.
   * @return {!THREE.Quaternion} the orientation quaternion
   */
  get orientation ()
  {
    const stateInfo = this.state;
    return new THREE.Quaternion(stateInfo[OSIndices.X_QUAT] || 0, stateInfo[OSIndices.Y_QUAT] || 0, stateInfo[OSIndices.Z_QUAT] || 0, stateInfo[OSIndices.W_QUAT] !== undefined ? stateInfo[OSIndices.W_QUAT] : 1);
  }

  /**
   * Set the orientation of the object.
   * @param {!THREE.Quaternion} rot the orientation quaternion
   * @return {void}
   */
  set orientation (rot)
  {
    this.state[OSIndices.X_QUAT] = rot.x;
    this.state[OSIndices.Y_QUAT] = rot.y;
    this.state[OSIndices.Z_QUAT] = rot.z;
    this.state[OSIndices.W_QUAT] = rot.w;
  }

  /**
   * Checks ObjectState for validity.
   * @return {boolean} true if the orientation quaternion is well defined, false otherwise
   */
  isValid ()
  {
    const stateInfo = this.state;
    return stateInfo[OSIndices.X_QUAT] !== 0 || stateInfo[OSIndices.Y_QUAT] !== 0 || stateInfo[OSIndices.Z_QUAT] !== 0 || stateInfo[OSIndices.W_QUAT] !== 0;
  }

  /**
   * Encode the given object state information into a more memory friendly array representation.
   * 
   * @param {number} x the x position of the object
   * @param {number} y the y position of the object
   * @param {number} z the z position of the object
   * @param {number} qx the x-term of the quaternion vector
   * @param {number} qy the y-term of the quaternion vector
   * @param {number} qz the z-term of the quaternion vector
   * @param {number} qw the scalar term of the quaternion
   * @param {!Array<number> | !Float32Array=} target the target array
   * @return {!Array<number> | !Float32Array} the array encoded state information
   */
  static encodeObjectState (x, y, z, qx, qy, qz, qw, target)
  {
    if (target === undefined) {
      target = new Float32Array(7);
    }

    target[OSIndices.X_POS] = x;
    target[OSIndices.Y_POS] = y;
    target[OSIndices.Z_POS] = z;

    target[OSIndices.X_QUAT] = qx;
    target[OSIndices.Y_QUAT] = qy;
    target[OSIndices.Z_QUAT] = qz;
    target[OSIndices.W_QUAT] = qw;

    return target;
  }
}

export { OSIndices, ObjectState };
