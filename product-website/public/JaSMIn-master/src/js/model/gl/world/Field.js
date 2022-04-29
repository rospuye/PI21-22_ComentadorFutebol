import { ParameterMap } from '../../game/utils/ParameterMap.js';
import { Environment3DParams } from '../../game/utils/SparkUtil.js';
import { GameType } from '../../game/utils/GameUtil.js';

/**
 * The Field class definition.
 *
 * @author Stefan Glaser
 */
class Field
{
  /**
   * Field Constructor
   *
   * @param {!THREE.Vector2=} fieldDimensions the dimensions of the soccer pitch
   * @param {number=} centerRadius the center circle raduis
   * @param {!THREE.Vector3=} goalDimensions the dimensions of the goals
   * @param {!THREE.Vector2=} goalAreaDimensions the dimensions of the goal areas
   * @param {?THREE.Vector3=} penaltyAreaDimensions the dimensions of the penalty area + penalty kick spot
   */
  constructor (fieldDimensions, centerRadius, goalDimensions, goalAreaDimensions, penaltyAreaDimensions)
  {
    /**
     * The field object group
     * @type {!THREE.Object3D}
     */
    this.objGroup = new THREE.Object3D();
    this.objGroup.name = 'field';

    /**
     * The dimensions of the field
     * @type {!THREE.Vector2}
     */
    this.fieldDimensions = fieldDimensions !== undefined ? fieldDimensions : new THREE.Vector2(105, 68);

    /**
     * The radius of the center circle
     * @type {number}
     */
    this.centerRadius = centerRadius !== undefined ? centerRadius : 9.15;

    /**
     * The dimensions of the goals
     * @type {!THREE.Vector3}
     */
    this.goalDimensions = goalDimensions !== undefined ? goalDimensions : new THREE.Vector3(1.2, 14.64, 1.5);

    /**
     * The dimensions of the goal area
     * @type {!THREE.Vector2}
     */
    this.goalAreaDimensions = goalAreaDimensions !== undefined ? goalAreaDimensions : new THREE.Vector2(5.5, 18.32);

    /**
     * The dimensions of the penalty area + penalty kick spot
     * @type {?THREE.Vector3}
     */
    this.penaltyAreaDimensions = penaltyAreaDimensions !== undefined ? penaltyAreaDimensions : new THREE.Vector3(16.5, 40.3, 11);

    /**
     * The field texture repeat.
     * @type {?number}
     */
    this.textureRepeat = 10;

    /**
     * The width of the field lines.
     * @type {number}
     */
    this.lineWidth = 0.15;
  }

  /**
   * Set the field properties based on the given environement parameter map.
   *
   * @param {!GameType} type the game type (2D or 3D)
   * @param {!ParameterMap} environmentParams the environment parameter map
   */
  set (type, environmentParams)
  {
    if (type === GameType.TWOD) {
      this.fieldDimensions = new THREE.Vector2(105, 68);
      this.centerRadius = 9.15;
      this.goalDimensions = new THREE.Vector3(1.2, 14.64, 1.5);
      this.goalAreaDimensions = new THREE.Vector2(5.5, 18.32);
      this.penaltyAreaDimensions = new THREE.Vector3(16.5, 40.3, 11);
      this.lineWidth = 0.15;
    } else {
      // Read field dimensions
      const fieldLength = environmentParams.getNumber(Environment3DParams.FIELD_LENGTH);
      const fieldWidth = environmentParams.getNumber(Environment3DParams.FIELD_WIDTH);
      // const fieldHeight = environmentParams.getNumber(Environment3DParams.FIELD_HEIGHT);
      if (fieldLength !== null && fieldWidth !== null) {
        this.fieldDimensions.set(fieldLength, fieldWidth);
      } else {
        this.fieldDimensions.set(30, 20);
      }

      // Read free kick distance (used for center circle radius)
      const freeKickDistance = environmentParams.getNumber(Environment3DParams.FREE_KICK_DISTANCE);
      if (freeKickDistance !== null) {
        this.centerRadius = freeKickDistance;
      } else {
        this.centerRadius = 2;
      }

      // Read goal dimensions
      const goalWidth = environmentParams.getNumber(Environment3DParams.GOAL_WIDTH);
      const goalDepth = environmentParams.getNumber(Environment3DParams.GOAL_DEPTH);
      const goalHeight = environmentParams.getNumber(Environment3DParams.GOAL_HEIGHT);
      if (goalDepth !== null && goalWidth !== null && goalHeight !== null) {
        this.goalDimensions.set(goalDepth, goalWidth, goalHeight);
      } else {
        this.goalDimensions.set(0.6, 2.1, 0.8);
      }

      // Clear penalty area and set goal area and line width based on field size
      this.penaltyAreaDimensions = null;

      if (this.fieldDimensions.x < 15) {
        this.goalAreaDimensions.set(1.2, 4);
        this.lineWidth = 0.03;
      } else {
        this.goalAreaDimensions.set(1.8, 6);
        this.lineWidth = 0.04;
      }
    }

    this.textureRepeat = this.fieldDimensions.x > 50 ? 10 : null;
  }

  /**
   * Check if this world parameters define a penalty area.
   *
   * @return {boolean} true, if there exists a definition for the penalty area, false otherwise
   */
  hasPenaltyArea ()
  {
    return this.penaltyAreaDimensions !== null;
  }
}

export { Field };
