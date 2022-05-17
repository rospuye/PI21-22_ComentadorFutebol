import { GameState } from './GameState.js';
import { GameScore } from './GameScore.js';
import { ObjectState } from './ObjectState.js';
import { AgentState } from './AgentState.js';

/**
 * The WorldState class definition.
 *
 * The WorldState provides information about the state of the game, the ball and all agents on the field.
 *
 * @author Stefan Glaser
 */
class WorldState
{
  /**
   * WorldState Constructor
   * Create a new WorldState holding the given information.
   *
   * @param {number} time the global time
   * @param {number} gameTime the game time
   * @param {!GameState} gameState the game state
   * @param {!GameScore} score the game score
   * @param {!Array<number> | !Float32Array} ball the ball state
   * @param {!Array<!Array<number> | !Float32Array | undefined>} leftAgents array of agent states for the left team
   * @param {!Array<!Array<number> | !Float32Array | undefined>} rightAgents array of agent states for the right team
   */
  constructor (time, gameTime, gameState, score, ball, leftAgents, rightAgents)
  {
    /**
     * The global time.
     * @type {number}
     */
    this.time = time;

    /**
     * The game time.
     * @type {number}
     */
    this.gameTime = gameTime;

    /**
     * The state of the game.
     * @type {!GameState}
     */
    this.gameState = gameState;

    /**
     * The game score.
     * @type {!GameScore}
     */
    this.score = score;

    /**
     * The state of the ball.
     * @type {!Array<number> | !Float32Array}
     */
    this.ballStateArr = ball;

    /**
     * The states of all left agents.
     * @type {!Array<!Array<number> | !Float32Array | undefined>}
     */
    this.leftAgentStateArrs = leftAgents;

    /**
     * The states of all right agents.
     * @type {!Array<!Array<number> | !Float32Array | undefined>}
     */
    this.rightAgentStateArrs = rightAgents;
  }

  /**
   * Retrieve the ball state.
   * 
   * @return {!ObjectState}
   */
  get ballState ()
  {
    return new ObjectState(this.ballStateArr);
  }

  /**
   * Retrieve the list of left agent states.
   * 
   * @return {!Array<!AgentState | undefined>}
   */
  get leftAgentStates ()
  {
    return WorldState.wrapAgentStatesArray(this.leftAgentStateArrs);
  }

  /**
   * Retrieve the list of right agent states.
   * 
   * @return {!Array<!AgentState | undefined>}
   */
  get rightAgentStates ()
  {
    return WorldState.wrapAgentStatesArray(this.rightAgentStateArrs);
  }

  /**
   * Wrap agent state arrays in actual agent state objects.
   * 
   * @param {!Array<!Array<number> | !Float32Array | undefined>} statesArr the array of states to wrap
   * @return {!Array<!AgentState | undefined>}
   */
  static wrapAgentStatesArray (statesArr)
  {
    return statesArr.map(stateArr => stateArr !== undefined ? new AgentState(stateArr) : undefined);
  }

  /**
   * Extract the list of underlying agent state information arrays.
   * 
   * @param {!Array<!AgentState | undefined>} agentStates the array of agent states to unwrap
   * @return {!Array<!Array<number> | !Float32Array | undefined>}
   */
  static unwrapAgentStatesArray (agentStates)
  {
    return agentStates.map(agentState => agentState !== undefined ? agentState.state : undefined);
  }
}

export { WorldState };