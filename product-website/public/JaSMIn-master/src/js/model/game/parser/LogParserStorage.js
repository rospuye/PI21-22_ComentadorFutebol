import { PartialWorldState } from './PartialWorldState.js';

/**
 * The LogParserStorage class definition.
 *
 * @author Stefan Glaser
 */
class LogParserStorage
{
  /**
   * LogParserStorage Constructor
   */
  constructor ()
  {
    /**
     * The partial state used during parsing.
     * @type {?PartialWorldState}
     */
    this.partialState = null;

    /**
     * The maximum states to parse per run.
     * @type {number}
     */
    this.maxStates = 500;

    /**
     * The index list for the recent player types of the individual agents of the left team.
     * @type {!Array<number>}
     */
    this.leftIndexList = [];

    /**
     * The index list for the recent player types of the individual agents of the right team.
     * @type {!Array<number>}
     */
    this.rightIndexList = [];
  }

  /**
   * Check if a partial state instance exists.
   *
   * @return {boolean} true, if the partial state exists, false otherwise
   */
  hasPartialState ()
  {
    return this.partialState !== null;
  }
}

export { LogParserStorage };
