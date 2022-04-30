import { MovableObject } from './MovableObject.js';
import { ObjectState } from '../../game/ObjectState.js';

/**
 * The Ball class definition.
 *
 * @author Stefan Glaser
 */
class Ball extends MovableObject
{
  /**
   * Ball Constructor
   *
   * @param {number=} radius the ball radius
   */
  constructor (radius)
  {
    super('ball');

    /**
     * The radius of the ball.
     * @type {number}
     */
    this.radius = radius !== undefined ? radius : 0.2;

    this.objGroup.scale.setScalar(this.radius);
  }

  /**
   * Set the ball radius.
   *
   * @param  {number} radius the new ball radius
   * @return {void}
   */
  setRadius (radius)
  {
    if (this.radius !== radius) {
      this.radius = radius;
      this.objGroup.scale.setScalar(this.radius);
    }
  }

  /**
   * Update movable object
   *
   * @param  {!ObjectState} state the current object state
   * @param  {!ObjectState=} nextState the next object state
   * @param  {number=} t the interpolated time between the current and next state
   * @return {void}
   */
  update (state, nextState, t)
  {
    this.updateBodyPose(state, nextState, t);
  }
}

export { Ball };
