import { AgentDescription } from './AgentDescription.js';
import { ParameterMap } from './utils/ParameterMap.js';
import { TeamSide, GameUtil } from './utils/GameUtil.js';

/**
 * The TeamDescription class definition.
 *
 * The TeamDescription provides information about a team.
 *
 * @author Stefan Glaser
 */
class TeamDescription
{
  /**
   * TeamDescription Constructor
   * Create a new TeamDescription with the given parameters.
   *
   * @param {string} name the name of the team
   * @param {!THREE.Color} color the team color
   * @param {!TeamSide} side the team side (see TeamSide)
   */
  constructor (name, color, side)
  {
    /**
     * The name of the team.
     * @type {string}
     */
    this.name = name;

    /**
     * The list of agents playing for this team.
     * @type {!Array<!AgentDescription>}
     */
    this.agents = [];

    /**
     * The team color.
     * @type {!THREE.Color}
     */
    this.color = color;

    /**
     * The team side (see TeamSide)
     * @type {!TeamSide}
     */
    this.side = side;
  }

  /**
   * Set the name of this team.
   *
   * @param {string} name the new name of the team
   * @return {boolean} true, if the name was updated, false otherwise
   */
  setName (name)
  {
    const newName = name.split('_').join(' ');

    if (this.name !== newName) {
      this.name = newName;
      return true;
    }

    return false;
  }

  /**
   * Set the color of this team.
   *
   * @param {!THREE.Color} color the new color of the team
   * @return {boolean} true, if the color was updated, false otherwise
   */
  setColor (color)
  {
    if (!this.color.equals(color)) {
      this.color = color;
      return true;
    }

    return false;
  }

  /**
   * Add an agent description for the given player number and robot model.
   * If there doesn't exist an agent description to the given player number,
   * this method will create a new agent description with the given player number and robot model.
   * If there already exists an agent description with the given player number,
   * this method will add the given robot model to the agent description if it is not yet present.
   *
   * @param {number} number the agent player number
   * @param {!ParameterMap} playerType the player type
   * @return {boolean} false if nothing was modified, true otherwise
   */
  addAgent (number, playerType)
  {
    let i = this.agents.length;

    // Check if there already exists a agent description with the given number
    while (i--) {
      if (this.agents[i].playerNo === number) {
        // Add the given player type to the agent
        return this.agents[i].addPlayerType(playerType);
      }
    }

    // If no agent definition was found for the given player number, create a new one
    this.agents.push(new AgentDescription(number, this.side, playerType));

    return true;
  }

  /**
   * Retrieve the index of the last used player type specification of the agent with the given player number.
   *
   * @param  {number} number the player number of the agent of interest
   * @return {number} the index of the last used player type specification
   */
  getRecentTypeIdx (number)
  {
    let i = this.agents.length;

    // Retrieve the requested index from the agent description if existing
    while (i--) {
      if (this.agents[i].playerNo === number) {
        return this.agents[i].recentTypeIdx;
      }
    }

    // return zero by default, if no corresponding agent description was found
    return 0;
  }

  /**
   * Retrieve a letter representing the side.
   *
   * @param  {boolean=} uppercase true for upper case letter, false for lower case
   * @return {string} 'l'/'L' for left side, 'r'/'R' for right side and 'n'/'N' for neutral
   */
  getSideLetter (uppercase)
  {
    return GameUtil.getSideLetter(this.side, uppercase);
  }
}

export { TeamDescription };
