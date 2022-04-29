import { ParameterMap } from '../../../game/utils/ParameterMap.js';
import { RobotModel } from '../RobotModel.js';
import { TeamSide } from '../../../game/utils/GameUtil.js';



/**
 * RobotModelFactory Interface.
 */
class RobotModelFactory
{
  constructor () {}

  /**
   * Create a robot model to the given player type.
   *
   * @param  {!ParameterMap} playerType the player type
   * @param  {!TeamSide} side the team side
   * @param  {number} playerNo the player number
   * @param  {!ParameterMap} environmentParams the environment paraméter
   * @param  {!ParameterMap} playerParams the player paraméter
   * @return {?RobotModel} a new robot model
   */
  createModel (playerType, side, playerNo, environmentParams, playerParams) {}


  /**
   * Dispose all resources allocated within this factory.
   *
   * @return {void}
   */
  dispose () {}
}

export { RobotModelFactory };
