/**
 * Enum holding the known game types.
 * @enum {number}
 */
const GameType = {
  TWOD: 1,
  THREED: 2
};

/**
 * An enum for the side of a team.
 * @enum {number}
 */
const TeamSide = {
  LEFT: -1,
  NEUTRAL: 0,
  RIGHT: 1
};

/**
 *
 * @author Stefan Glaser
 */
class GameUtil
{
  /**
   * Retrieve a letter representing the side.
   *
   * @param  {!TeamSide} side the side value
   * @param  {boolean=} uppercase true for upper case letter, false for lower case
   * @return {string} 'l'/'L' for left side, 'r'/'R' for right side, 'n'/'N' for neutral
   */
  static getSideLetter (side, uppercase)
  {
    if (uppercase) {
      return side === TeamSide.LEFT ? 'L' : side === TeamSide.RIGHT ? 'R' : 'N';
    } else {
      return side === TeamSide.LEFT ? 'l' : side === TeamSide.RIGHT ? 'r' : 'n';
    }
  }
}

export { GameType, TeamSide, GameUtil };
