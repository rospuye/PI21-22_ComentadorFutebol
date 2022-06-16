/**
 * Simple THREE.js helpers.
 * 
 * @author Stefan Glaser
 */
class ThreeJsUtil
{
  /** @return {!THREE.Vector3} 3D Zero vector. */
  static Vector3_Zero()
  {
    return Vector3_zero;
  }

  /** @return {!THREE.Vector3} 3D Unit X vector. */
  static Vector3_UnitX()
  {
    return Vector3_unitX;
  }

  /** @return {!THREE.Vector3} 3D Unit Y vector. */
  static Vector3_UnitY()
  {
    return Vector3_unitY;
  }

  /** @return {!THREE.Vector3} 3D Unit Z vector. */
  static Vector3_UnitZ()
  {
    return Vector3_unitZ;
  }


  /** @return {!THREE.Color} White color. */
  static Color_White()
  {
    return Color_white;
  }

  /** @return {!THREE.Color} Black color. */
  static Color_Black()
  {
    return Color_black;
  }

  /** @return {!THREE.Color} #eee color. */
  static Color_LightGrey()
  {
    return Color_eee;
  }

  /** @return {!THREE.Color} #333 color. */
  static Color_DarkGrey()
  {
    return Color_333;
  }


  /**
   * Make Matrtix 4x4.
   *
   * @param  {number} n11
   * @param  {number} n12
   * @param  {number} n13
   * @param  {number} n14
   * @param  {number} n21
   * @param  {number} n22
   * @param  {number} n23
   * @param  {number} n24
   * @param  {number} n31
   * @param  {number} n32
   * @param  {number} n33
   * @param  {number} n34
   * @return {!THREE.Matrix4} a 4x4 matrix
   */
  static mM4 (n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34) {
    return new THREE.Matrix4().set(n11, n12, n13, n14,
                                   n21, n22, n23, n24,
                                   n31, n32, n33, n34,
                                   0, 0, 0, 1);
  }
}

export { ThreeJsUtil };

/**
 * A THREE.Vector3 instance representing the zero vector (0, 0, 0).
 * @const {!THREE.Vector3}
 */
export const Vector3_zero = new THREE.Vector3(0, 0, 0);

/**
 * A THREE.Vector3 instance representing the X unit vector (1, 0, 0).
 * @const {!THREE.Vector3}
 */
export const Vector3_unitX = new THREE.Vector3(1, 0, 0);

/**
 * A THREE.Vector3 instance representing the Y unit vector (0, 1, 0).
 * @const {!THREE.Vector3}
 */
export const Vector3_unitY = new THREE.Vector3(0, 1, 0);

/**
 * A THREE.Vector3 instance representing the Z unit vector (0, 0, 1).
 * @const {!THREE.Vector3}
 */
export const Vector3_unitZ = new THREE.Vector3(0, 0, 1);



/**
 * A white threejs color.
 * @type {!THREE.Color}
 */
export const Color_white = new THREE.Color(0xffffff);

/**
 * A black threejs color.
 * @type {!THREE.Color}
 */
export const Color_black = new THREE.Color(0x000000);

/**
 * A threejs color with color value #eeeeee.
 * @type {!THREE.Color}
 */
export const Color_eee = new THREE.Color(0xeeeeee);

/**
 * A threejs color with color value #333333.
 * @type {!THREE.Color}
 */
export const Color_333 = new THREE.Color(0x333333);
