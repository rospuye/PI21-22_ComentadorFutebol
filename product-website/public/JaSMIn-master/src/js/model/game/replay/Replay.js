import { GameLog } from '../GameLog.js';
import { GameType } from '../utils/GameUtil.js';

/**
 * The Replay class definition.
 *
 * The Replay is the central class holding a replay file
 *
 * @author Stefan Glaser
 */
class Replay extends GameLog
{
  /**
   * Replay Constructor
   * Create a new replay.
   * 
   * @param {!GameType} type the game-log type
   * @param {number} version the replay version
   */
  constructor (type, version)
  {
    super(type);

    /**
     * The replay version.
     * @type {number}
     */
    this.version = version;
  }
}

export { Replay };
