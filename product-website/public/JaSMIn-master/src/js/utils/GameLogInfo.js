import { FileUtil } from './FileUtil.js';

/**
 * The GameLogInfo class definition.
 *
 * @author Stefan Glaser
 */
class GameLogInfo
{
  /**
   * GameLogInfo Constructor
   *
   * @param {number} year the year of recording
   * @param {number} month the month of recording
   * @param {number} day the day of recording
   * @param {number} hour the of recording
   * @param {number} minute the minutor of recording
   * @param {string} leftTeamName the name of the left team
   * @param {number} leftScore the score of the left team
   * @param {string} rightTeamName the name of the right team
   * @param {number} rightScore the score of the right team
   */
  constructor (year, month, day, hour, minute, leftTeamName, leftScore, rightTeamName, rightScore)
  {
    /**
     * The year in which the game was played.
     * @type {number}
     */
    this.year = year;

    /**
     * The month in which the game was played.
     * @type {number}
     */
    this.month = month;

    /**
     * The day in which the game was played.
     * @type {number}
     */
    this.day = day;

    /**
     * The hour of the day in which the game was played.
     * @type {number}
     */
    this.hour = hour;

    /**
     * The minute within the hour of the day in which the game was played.
     * @type {number}
     */
    this.minute = minute;

    /**
     * The name of the left team.
     * @type {string}
     */
    this.leftTeamName = leftTeamName;

    /**
     * The score of the left team.
     * @type {number}
     */
    this.leftScore = leftScore;

    /**
     * The name of the right team.
     * @type {string}
     */
    this.rightTeamName = rightTeamName;

    /**
     * The score of the right team.
     * @type {number}
     */
    this.rightScore = rightScore;
  }

  /**
   * Parse a new game log info instance from the given file url.
   *
   * @param {string} url the url to extract the game log from
   * @return {?GameLogInfo} the new game log info instance, or null if parsing failed
   */
  static fromURL (url)
  {
    return GameLogInfo.fromFileName(FileUtil.getFileName(url));
  }

  /**
   * Parse a new game log info instance from the given file name.
   *
   * @param {string} name the game log file name to extract the game log info from
   * @return {?GameLogInfo} the new game log info instance, or null if parsing failed
   */
  static fromFileName (name)
  {
    // Typical log format (which we are looking for):
    // YYYYMMDDhhmm{_|-}<left-team>_<left-score>{_|-}vs{_|-}<right-team>_<right-score>.<suffix>
    const regex = /^([\d]{4})([\d]{2})([\d]{2})([\d]{2})([\d]{2})[-_](.+)_([\d]+)[-_]vs[-_](.+)_([\d]+)\..*/g;
    const tokens = regex.exec(name);

    if (tokens) {
      // Found matching pattern
      return new GameLogInfo(
          parseInt(tokens[1], 10), // Year
          parseInt(tokens[2], 10), // Month
          parseInt(tokens[3], 10), // Day
          parseInt(tokens[4], 10), // Hour
          parseInt(tokens[5], 10), // Minute
          tokens[6],               // Left team
          parseInt(tokens[7], 10), // Left score
          tokens[8],               // Right team
          parseInt(tokens[9], 10)  // Right score
        );
    }

    return null;
  }
}

export { GameLogInfo };
