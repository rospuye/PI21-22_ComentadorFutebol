/**
 * Simple math helpers.
 * 
 * @author Stefan Glaser
 */
class JsMath
{
  /**
   * Transform degrees to radians.
   * @param {number} deg
   * @return {number}
   */
  static toRad (deg)
  {
    return deg * Math.PI / 180;
  };

  /**
   * Transform radians to degrees.
   * @param {number} rad
   * @return {number}
   */
  static toDeg (rad)
  {
    return rad * 180 / Math.PI;
  };
}

export { JsMath };

/**
 * @type {number}
 */
export const PIby180 = Math.PI / 180.0;

/**
 * @type {number}
 */
export const NegPIby180 = -Math.PI / 180.0;
