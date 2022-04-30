import { GameScore } from './GameScore.js';
import { GameState } from './GameState.js';
import { ParameterMap } from './utils/ParameterMap.js';
import { TeamDescription } from './TeamDescription.js';
import { WorldState } from './WorldState.js';
import { SparkUtil, Environment3DParams } from './utils/SparkUtil.js';
import { SServerUtil, Environment2DParams } from './utils/SServerUtil.js';
import { GameType, TeamSide } from './utils/GameUtil.js';


/**
 * @enum {string}
 */
export const GameLogChangeEvents = {
  TEAMS: 'teams',
  STATES: 'states'
};

/**
 * The GameLog class definition.
 *
 * The GameLog is the central class holding a game log.
 *
 * @author Stefan Glaser
 */
class GameLog
{
  /**
   * GameLog Constructor
   * Create a new game log.
   * 
   * @param {!GameType} type the game type
   */
  constructor (type)
  {
    /**
     * The log file url.
     * @type {?string}
     */
    this.url = null;

    /**
     * The game type (2D or 3D).
     * @type {!GameType}
     */
    this.type = type;

    /**
     * The state update frequency of the game log.
     * @type {number}
     */
    this.frequency = 1;

    /**
     * The list of server/simulation environment parameters.
     * @type {!ParameterMap}
     */
    this.environmentParams = new ParameterMap();

    /**
     * The list of player parameters.
     * @type {!ParameterMap}
     */
    this.playerParams = new ParameterMap();

    /**
     * The list of player type parameters.
     * @type {!Array<!ParameterMap>}
     */
    this.playerTypes = [];

    /**
     * The description of the left team.
     * @type {!TeamDescription}
     */
    this.leftTeam = new TeamDescription('Left Team', new THREE.Color(0xffff00), TeamSide.LEFT);

    /**
     * The description of the right team.
     * @type {!TeamDescription}
     */
    this.rightTeam = new TeamDescription('Right Team', new THREE.Color(0xff0000), TeamSide.RIGHT);

    /**
     * The list of all world states.
     * @type {!Array<!WorldState>}
     */
    this.states = [];

    /**
     * The time value of the first state.
     * @type {number}
     */
    this.startTime = 0;

    /**
     * The time value of the last state.
     * @type {number}
     */
    this.endTime = 0;

    /**
     * The duration of the game log.
     * @type {number}
     */
    this.duration = 0;

    /**
     * A list of game states over time.
     * @type {!Array<!GameState>}
     */
    this.gameStateList = [];

    /**
     * A list of game scores over time.
     * @type {!Array<!GameScore>}
     */
    this.gameScoreList = [];

    /**
     * Indicator if the game log is fully loaded.
     * @type {boolean}
     */
    this.fullyLoaded = false;

    /**
     * The callback function to call when this game log instance is refreshed
     * @type {!Function | undefined}
     */
    this.onChange = undefined;

    // Create defaults
    if (type === GameType.TWOD) {
      this.environmentParams = SServerUtil.createDefaultEnvironmentParams();
      this.playerParams = SServerUtil.createDefaultPlayerParams();
      this.playerTypes = SServerUtil.createDefaultPlayerTypeParams();
    } else {
      this.environmentParams = SparkUtil.createDefaultEnvironmentParams();
      this.playerParams = SparkUtil.createDefaultPlayerParams();
      this.playerTypes = SparkUtil.createDefaultPlayerTypeParams();
    }

    this.updateFrequency();
  }

  /**
   * Update the frequency value from environment parameter list.
   *
   * @return {void}
   */
  updateFrequency ()
  {
    let step = null;

    if (this.type === GameType.TWOD) {
      step = this.environmentParams.getNumber(Environment2DParams.SIMULATOR_STEP);
    } else {
      step = this.environmentParams.getNumber(Environment3DParams.LOG_STEP);
    }

    if (step) {
      this.frequency = 1000 / step;
    }
  }

  /**
   * Fetch the index of the world state that corresponds to the given time.
   *
   * @param  {number} time the global time
   * @return {number} the world state index corresponding to the specified time
   */
  getIndexForTime (time)
  {
    const idx = Math.floor(time * this.frequency);

    if (idx < 0) {
      return 0;
    } else if (idx >= this.states.length) {
      return this.states.length - 1;
    }

    return idx;
  }

  /**
   * Retrieve the world state for the given time.
   *
   * @param  {number} time the global time
   * @return {!WorldState | undefined} the world state closest to the specified time
   */
  getStateForTime (time)
  {
    return this.states[this.getIndexForTime(time)];
  }

  /**
   * Called to indicate that the team descriptions of the game log were updated.
   *
   * @return {void}
   */
  onTeamsUpdated ()
  {
    if (this.onChange !== undefined) {
      this.onChange(GameLogChangeEvents.TEAMS);
    }
  }

  /**
   * Called to indicate that the game log data was changed/extended.
   *
   * @return {void}
   */
  onStatesUpdated ()
  {
    // Update times
    if (this.states.length > 0) {
      this.startTime = this.states[0].time;
      this.endTime = this.states[this.states.length - 1].time;
      this.duration = this.endTime - this.startTime;

      // Extract game states and scores from state array
      this.gameStateList = [];
      this.gameScoreList = [];

      let previousGameState = this.states[0].gameState;
      let previousScore = this.states[0].score;
      this.gameStateList.push(previousGameState);
      this.gameScoreList.push(previousScore);

      for (let i = 1; i < this.states.length; i++) {
        if (previousGameState !== this.states[i].gameState) {
          previousGameState = this.states[i].gameState;
          this.gameStateList.push(previousGameState);
        }

        if (previousScore !== this.states[i].score) {
          previousScore = this.states[i].score;
          this.gameScoreList.push(previousScore);
        }
      }
    }

    if (this.onChange !== undefined) {
      this.onChange(GameLogChangeEvents.STATES);
    }
  }

  /**
   * Called to indicate that the game log file is fully loaded and parsed and no further states, etc. will be appended.
   *
   * @return {void}
   */
  finalize ()
  {
    this.fullyLoaded = true;

    // Refresh the game log information a last time and publish change to finished
    this.onStatesUpdated();

    // Clear onChange listener
    this.onChange = undefined;
  }
}

export { GameLog };
