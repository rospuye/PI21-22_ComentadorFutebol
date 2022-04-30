import { ParameterMap } from './utils/ParameterMap.js';
import { TeamSide, GameUtil } from './utils/GameUtil.js';

/**
 * The AgentDescription class definition.
 *
 * The AgentDescription provides information about the robot model and player number of an agent.
 *
 * @author Stefan Glaser
 */
class AgentDescription
{
  /**
   * AgentDescription Constructor
   * Create a new AgentDescription.
   *
   * @param {number} number the player number of this agent
   * @param {!TeamSide} side the team side
   * @param {!ParameterMap} playerType the initial player type specification of this agent
   */
  constructor (number, side, playerType)
  {
    /**
     * The player number of the agent.
     * @type {number}
     */
    this.playerNo = number;

    /**
     * The agent's team side.
     * @type {!TeamSide}
     */
    this.side = side;

    /**
     * A list of player type indices, used by this agent.
     * @type {!Array<!ParameterMap>}
     */
    this.playerTypes = [];
    this.playerTypes.push(playerType);

    /**
     * The index of the last used player type of this agent.
     * @type {number}
     */
    this.recentTypeIdx = 0;
  }

  /**
   * Check if this agent is the goal keeper.
   * @return {boolean} true if this agent is the goal keeper, false otherwise
   */
  isGoalie ()
  {
    return this.playerNo == 1;
  }

  /**
   * Add the given player type specification to the list of player types if not yet present.
   *
   * @param {!ParameterMap} playerType the player type specification to add
   * @return {boolean} false if nothing was modified, true otherwise
   */
  addPlayerType (playerType)
  {
    const idx = this.playerTypes.indexOf(playerType);

    // Add player type to player type list if not yet present
    if (idx === -1) {
      this.playerTypes.push(playerType);
      this.recentTypeIdx = this.playerTypes.length - 1;
      return true;
    } else {
      this.recentTypeIdx = idx;
      return false;
    }
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

export { AgentDescription };