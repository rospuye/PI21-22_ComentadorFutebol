import { ObjectState } from './ObjectState.js';

/**
 * Indices in the agent state array.
 * @enum {number}
 */
 const ASIndices = {
  MODEL_IDX: 7,
  FLAGS: 8,
  DATA_IDX: 9,
  JOINT_ANGLES: 10
};



/**
 * The AgentState class definition.
 *
 * The AgentState provides information about the state of an agent at a specific time.
 *
 * @author Stefan Glaser
 */
class AgentState extends ObjectState
{
  /**
   * AgentState Constructor
   * Create a new AgentState for the given state information.
   * 
   * @param {!Array<number> |
   *         !Float32Array |
   *         {
   *           modelIdx: number,
   *           flags: number,
   *           x: number,
   *           y: number,
   *           z: number,
   *           qx: number,
   *           qy: number,
   *           qz: number,
   *           qw: number,
   *           jointAngles: !Array<number>,
   *           data: !Array<number>
   *         }=} params the agent state parameter
   */
  constructor (params = undefined)
  {
    super((params instanceof Float32Array || params instanceof Array) ? params : []);

    if (params === undefined) {
      this.state = AgentState.encodeAgentState(0, 0, 0, 0, 0, 0, 0, 0, 1, [], []);
    } else if (!(params instanceof Float32Array || params instanceof Array)) {
      this.state = AgentState.encodeAgentState(params.modelIdx, params.flags, params.x, params.y, params.z, params.qx, params.qy, params.qz, params.qw, params.jointAngles, params.data);
    }
  }

  /**
   * Retrieve the index of the currently used robot model.
   * @return {number} the currently model index
   */
  get modelIndex ()
  {
    return Math.round(this.state[ASIndices.MODEL_IDX] || 0);
  }

  /**
   * Retrieve the agent flags bitfield.
   * @return {number} the flags bitfield
   */
  get flags ()
  {
    return this.state[ASIndices.FLAGS] || 0;
  }

  /**
   * Retreive the joint angles of the robot model.
   * @return {!Array<number> | !Float32Array} the joint angles
   */
  get jointAngles ()
  {
    return this.state.slice(ASIndices.JOINT_ANGLES, this.state[ASIndices.DATA_IDX]);
  }

  /**
   * Retreive the generic data associated with the agent (stamina, fouls, etc.).
   * @return {!Array<number> | !Float32Array} the generic agent data
   */
  get data ()
  {
    return this.state.slice(this.state[ASIndices.DATA_IDX]);
  }

  /**
   * @override
   * @returns {boolean}
   */
  isValid ()
  {
    return super.isValid() && this.state.length > ASIndices.DATA_IDX;
  }

  /**
   * Encode the given agent state information into a more memory friendly array representation.
   *
   * @param {number} modelIdx the index of the currently used robot model
   * @param {number} flags the flags bitfield
   * @param {number} x the x position of the object
   * @param {number} y the y position of the object
   * @param {number} z the z position of the object
   * @param {number} qx the x-term of the quaternion vector
   * @param {number} qy the y-term of the quaternion vector
   * @param {number} qz the z-term of the quaternion vector
   * @param {number} qw the scalar term of the quaternion
   * @param {!Array<number>} jointAngles array holding the joint angles
   * @param {!Array<number>} data dynamic data associated with the agent (stamina, fouls, etc.)
   * @param {!Array<number> | !Float32Array=} target the target array
   * @return {!Array<number> | !Float32Array} the array encoded state information
   */
  static encodeAgentState (modelIdx, flags, x, y, z, qx, qy, qz, qw, jointAngles, data, target = undefined)
  {
    if (target === undefined) {
      target = new Float32Array(7 + 3 + jointAngles.length + data.length);
    }

    ObjectState.encodeObjectState(x, y, z, qx, qy, qz, qw, target);

    const dataIdx = ASIndices.JOINT_ANGLES + jointAngles.length;
    target[ASIndices.MODEL_IDX] = modelIdx;
    target[ASIndices.FLAGS] = flags;
    target[ASIndices.DATA_IDX] = dataIdx;

    for (let i = 0; i < jointAngles.length; i++) {
      target[ASIndices.JOINT_ANGLES + i] = jointAngles[i];
    }

    for (let i = 0; i < data.length; i++) {
      target[dataIdx + i] = data[i];
    }

    return target;
  }
}

export { ASIndices, AgentState };
