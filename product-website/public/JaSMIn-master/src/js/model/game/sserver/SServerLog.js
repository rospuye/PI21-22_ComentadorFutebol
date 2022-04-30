import { GameLog } from '../GameLog.js';
import { GameType } from '../utils/GameUtil.js';

/**
 * The SServerLog class definition.
 *
 * The SServerLog is the central class holding a soccer-server 2D game log file.
 *
 * @author Stefan Glaser
 */
class SServerLog extends GameLog
{
  /**
   * SServerLog Constructor
   * Create a new sserver game log file.
   *
   * @param {number} version the ulg log version
   */
  constructor (version)
  {
    super(GameType.TWOD);

    /**
     * The ulg log version.
     * @type {number}
     */
    this.version = version;
  }
}

export { SServerLog };
