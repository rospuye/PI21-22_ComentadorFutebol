/**
 * The GameScore class definition.
 *
 * The GameScore provides information about the current score of a game.
 *
 * @author Stefan Glaser
 */
class GameScore
{
  /**
   * GameScore Constructor
   * Create a new GameScore holding the scoring information.
   *
   * @param {number} time
   * @param {number} goalsLeft
   * @param {number} goalsRight
   * @param {number=} penScoreLeft
   * @param {number=} penMissLeft
   * @param {number=} penScoreRight
   * @param {number=} penMissRight
   */
  constructor (time, goalsLeft, goalsRight, penScoreLeft, penMissLeft, penScoreRight, penMissRight)
  {
    /**
     * The global time when this score was reached the first time.
     * @type {number}
     */
    this.time = time;

    /**
     * The left team score.
     * @type {number}
     */
    this.goalsLeft = goalsLeft;

    /**
     * The left team penalty score.
     * @type {number}
     */
    this.penaltyScoreLeft = penScoreLeft !== undefined ? penScoreLeft : 0;

    /**
     * The left team penalty misses.
     * @type {number}
     */
    this.penaltyMissLeft = penMissLeft !== undefined ? penMissLeft : 0;

    /**
     * The right team score.
     * @type {number}
     */
    this.goalsRight = goalsRight;

    /**
     * The right team penalty score.
     * @type {number}
     */
    this.penaltyScoreRight = penScoreRight !== undefined ? penScoreRight : 0;

    /**
     * The right team penalty misses.
     * @type {number}
     */
    this.penaltyMissRight = penMissRight !== undefined ? penMissRight : 0;
  }
}

export { GameScore };
