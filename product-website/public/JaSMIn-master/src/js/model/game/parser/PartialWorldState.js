import { GameScore } from '../GameScore.js';
import { GameState } from '../GameState.js';
import { AgentState } from '../AgentState.js';
import { ObjectState } from '../ObjectState.js';
import { WorldState } from '../WorldState.js';
import { MonitorUtil } from '../../../utils/MonitorUtil.js';

/**
 * The PartialWorldState class definition.
 *
 * The PartialWorldState provides information about the state of the game, the ball and all agents on the field.
 *
 * @author Stefan Glaser / http://chaosscripting.net
 */
class PartialWorldState
{
  /**
   * PartialWorldState Constructor
   * Create a new PartialWorldState holding the given information.
   *
   * @param {number} time the global time
   * @param {number} timeStep the global time step
   * @param {number} gameTime the game time
   */
  constructor (time, timeStep, gameTime)
  {
    /**
     * The global time.
     * @type {number}
     */
    this.time = time;

    /**
     * The global time step.
     * @type {number}
     */
    this.timeStep = timeStep;

    /**
     * The game time.
     * @type {number}
     */
    this.gameTime = gameTime;

    /**
     * The state of the game.
     * @type {!GameState}
     */
    this.gameState = new GameState(time, 'unknown');

    /**
     * The left team score.
     * @type {!GameScore}
     */
    this.score = new GameScore(time, 0, 0);

    /**
     * The state of the ball.
     * @type {!ObjectState}
     */
    this.ballState = new ObjectState();

    /**
     * The states of all left agents.
     * @type {!Array<!AgentState | undefined>}
     */
    this.leftAgentStates = [];

    /**
     * The states of all right agents.
     * @type {!Array<!AgentState | undefined>}
     */
    this.rightAgentStates = [];
  }

  /**
   * Reinitialize the gameTime attribute.
   *
   * @param {number} gameTime the game time
   */
  setGameTime (gameTime)
  {
    this.gameTime = Math.round(gameTime * 1000) / 1000;
  }

  /**
   * Reinitialize the gameState and gameTime attributes.
   *
   * @param {string} playMode the play mode string (will create a copy if needed)
   */
  setPlaymode (playMode)
  {
    if (this.gameState.playMode !== playMode) {
      this.gameState = new GameState(this.time, MonitorUtil.copyString(playMode));
    }
  }

  /**
   * Reinitialize the gameScore and gameTime attributes.
   *
   * @param {number} goalsLeft the left team score
   * @param {number} goalsRight the right team score
   * @param {number=} penScoreLeft the left team penalty score
   * @param {number=} penMissLeft the left team penalty misses
   * @param {number=} penScoreRight the right team penalty score
   * @param {number=} penMissRight the right team penalty misses
   */
  setScore (goalsLeft, goalsRight, penScoreLeft, penMissLeft, penScoreRight, penMissRight)
  {
    if (penScoreLeft === undefined) {
      penScoreLeft = 0;
    }
    if (penMissLeft === undefined) {
      penMissLeft = 0;
    }
    if (penScoreRight === undefined) {
      penScoreRight = 0;
    }
    if (penMissRight === undefined) {
      penMissRight = 0;
    }

    if (this.score.goalsLeft !== goalsLeft ||
        this.score.goalsRight !== goalsRight ||
        this.score.penaltyScoreLeft !== penScoreLeft ||
        this.score.penaltyMissLeft !== penMissLeft ||
        this.score.penaltyScoreRight !== penScoreRight ||
        this.score.penaltyMissRight !== penMissRight) {
      this.score = new GameScore(this.time, goalsLeft, goalsRight, penScoreLeft, penMissLeft, penScoreRight, penMissRight);
    }
  }

  /**
   * Create a new world state instance from this partial world state and append it to the list.
   * A new world state is only created if more then one agent state is present.
   *
   * @param  {!Array<!WorldState>} states the world state list
   * @return {boolean} true, if a new world state was appended, false otherwise
   */
  appendTo (states)
  {
    if (this.leftAgentStates.length + this.rightAgentStates.length > 0) {
      states.push(new WorldState(
          this.time,
          this.gameTime,
          this.gameState,
          this.score,
          this.ballState.state,
          WorldState.unwrapAgentStatesArray(this.leftAgentStates),
          WorldState.unwrapAgentStatesArray(this.rightAgentStates))
        );

      // Progress time
      this.time = Math.round((this.time + this.timeStep) * 1000) / 1000;

      // Reset agent states
      this.leftAgentStates = [];
      this.rightAgentStates = [];

      return true;
    }

    return false;
  }
}

export { PartialWorldState };
