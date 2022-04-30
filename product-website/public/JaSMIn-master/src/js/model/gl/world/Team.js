import { Agent } from './Agent.js';
import { TeamDescription } from '../../game/TeamDescription.js';
import { AgentState } from '../../game/AgentState.js';
import { TeamSide } from '../../game/utils/GameUtil.js';

/**
 * The Team class definition.
 *
 * @author Stefan Glaser
 */
class Team
{
  /**
   * Team Constructor
   *
   * @param {!TeamDescription} description
   * @param {!Array<!Agent>=} agents
   */
  constructor (description, agents = undefined)
  {
    /**
     * The team description
     * @type {!TeamDescription}
     */
    this.description = description;

    /**
     * The team object group.
     * @type {!THREE.Object3D}
     */
    this.objGroup = new THREE.Object3D();
    this.objGroup.name = description.side === TeamSide.LEFT ? 'leftTeam' : 'rightTeam';

    /**
     * The (dynamic) team color.
     * @type {!THREE.Color}
     */
    this.color = description.color;

    /**
     * The agents belonging to this team
     * @type {!Array<!Agent>}
     */
    this.agents = agents !== undefined ? agents : [];

    // Add all initial agents
    let i = this.agents.length;
    while (i--) {
      this.objGroup.add(this.agents[i].objGroup);
    }
  }

  /**
   * Set this team's description.
   *
   * @param {!TeamDescription} description
   * @return {void}
   */
  set (description)
  {
    this.description = description;
    this.color = description.color;
    this.agents = [];

    // Remove all child objects from team group
    let child = this.objGroup.children[0];
    while (child) {
      this.objGroup.remove(child);

      child = this.objGroup.children[0];
    }
  }

  /**
   * Update all agent objects of this team.
   *
   * @param  {!Array<!AgentState | undefined>} states the current Agent states
   * @param  {!Array<!AgentState | undefined>} nextStates the next Agent states
   * @param  {number} t the interpolation time
   * @return {void}
   */
  update (states, nextStates, t)
  {
    let i = this.agents.length;

    while (i--) {
      const no = this.agents[i].description.playerNo;

      this.agents[i].update(states[no], nextStates[no], t);
    }
  }

  /**
   * (Re)Set team color of all agents in this team.
   *
   * @param {!THREE.Color=} color the new team color (if undefined, the default team color from the description is used)
   */
  setColor (color)
  {
    const newColor = color === undefined ? this.description.color : color;

    if (!this.color.equals(newColor)) {
      this.color = newColor;

      let i = this.agents.length;

      while (i--) {
        this.agents[i].setTeamColor(this.color);
      }
    }
  }
}

export { Team };
