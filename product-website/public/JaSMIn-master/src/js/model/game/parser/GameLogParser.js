import { GameLog } from '../GameLog.js';
import { DataExtent } from '../../../utils/DataIterator.js';

/**
 * The GameLogParser interface definition.
 *
 * @author Stefan Glaser
 */
class GameLogParser
{
  /**
   * Parse the given data into a game log data structure.
   *
   * @param {string} data the game log file data
   * @param {!DataExtent=} extent the data extent: complete, partial or incremental data (default: complete)
   * @return {boolean} true, if a new game log file instance was created, false otherwise
   */
  parse (data, extent = DataExtent.COMPLETE) {}

  /**
   * Retrieve the currently parsed game log.
   *
   * @return {?GameLog} the (maybe partially) parsed game log
   */
  getGameLog () {}

  /**
   * Dispose all resources referenced in this parser instance.
   *
   * @param {boolean=} keepIteratorAlive indicator if iterator should not be disposed
   * @return {void}
   */
  dispose (keepIteratorAlive) {}
}

export { GameLogParser };
