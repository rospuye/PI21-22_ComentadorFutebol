/**
 * The GameState class definition.
 *
 * The GameState provides information about the current state of a game.
 *
 * @author Stefan Glaser
 */
class GameState
{
  /**
   * GameState Constructor
   * Create a new GameState holding the game state information.
   *
   * @param {number} time
   * @param {string} playMode
   */
  constructor (time, playMode)
  {
    /**
     * The global time when this state was reached.
     * @type {number}
     */
    this.time = time;

    /**
     * The play mode string.
     * @type {string}
     */
    this.playMode = playMode;
  }

  /**
   * Fetch the play mode string.
   *
   * @return {string} the play mode string
   */
  getPlayModeString ()
  {
    return this.playMode;
  }
}

export { GameState };
