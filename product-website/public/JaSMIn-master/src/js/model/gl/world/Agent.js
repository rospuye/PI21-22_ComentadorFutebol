import { MovableObject } from './MovableObject.js';
import { RobotModel } from './RobotModel.js';
import { AgentDescription } from '../../game/AgentDescription.js';
import { AgentState } from '../../game/AgentState.js';

/**
 * The Agent class definition.
 *
 * @author Stefan Glaser
 */
class Agent extends MovableObject
{
  /**
   * Agent Constructor
   *
   * @param {!AgentDescription} description the agent description
   */
  constructor (description)
  {
    super('agent_' + description.getSideLetter() + description.playerNo);

    /**
     * The agent description.
     * @type {!AgentDescription}
     */
    this.description = description;

    /**
     * The list of robot models
     * @type {!Array<!RobotModel>}
     */
    this.models = [];
  }

  /**
   * Update this agent's state.
   *
   * @param  {!AgentState=} state the current state
   * @param  {!AgentState=} nextState the next state
   * @param  {number=} t the interpolation step
   * @return {void}
   */
  update (state, nextState, t)
  {
    if (state === undefined || state.isValid() === false) {
      // Invalid data, thus kill agent
      this.objGroup.visible = false;
      return;
    } else if (this.objGroup.visible === false) {
      // Valid data, thus revive agent
      this.objGroup.visible = true;
    }

    // Update position and rotation of agent root object group
    this.updateBodyPose(state, nextState, t);

    // Activate agent model to current state
    this.setActiveModel(state.modelIndex);

    if (this.models[state.modelIndex] !== undefined) {
      const nextAngles = nextState !== undefined ? nextState.jointAngles : undefined;
      const nextData = nextState !== undefined ? nextState.data : undefined;

      this.models[state.modelIndex].update(state.jointAngles, state.data, nextAngles, nextData, t);
    }
  }

  /**
   * Set the active robot model to the current state
   * @param {number} modelIdx the index of the model
   */
  setActiveModel (modelIdx)
  {
    if (this.models[modelIdx] !== undefined && !this.models[modelIdx].isActive()) {
      let i = this.models.length;

      while (i--) {
        this.models[i].setActive(i === modelIdx);
      }
    }
  }

  /**
   * Set agent team color
   *
   * @param {!THREE.Color} color the new team color
   */
  setTeamColor (color)
  {
    let i = this.models.length;

    while (i--) {
      this.models[i].setTeamColor(color);
    }
  }
}

export { Agent };
