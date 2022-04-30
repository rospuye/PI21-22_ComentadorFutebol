import { RobotModelFactory } from '../RobotModelFactory.js';
import { MeshFactory } from '../../../utils/MeshFactory.js';
import { SoccerBot2D } from './SoccerBot2D.js';
import { SoccerBot2DSpecification, SoccerBot2DMaterialFactory, SoccerBot2DGeometryFactory } from './SoccerBot2DSpecification.js';

/**
 *
 * @author Stefan Glaser
 */
class SoccerBot2DModelFactory extends RobotModelFactory
{
  /**
   * SoccerBot2DModelFactory Constructor
   */
  constructor ()
  {
    super();
    
    /**
     * The mesh factory.
     * @type {!MeshFactory}
     */
    this.meshFactory = new MeshFactory(new SoccerBot2DGeometryFactory(), new SoccerBot2DMaterialFactory());
  }

  /**
   * Create a robot model to the given player type.
   *
   * @override
   * @param  {!ParameterMap} playerType the player type
   * @param  {!TeamSide} side the team side
   * @param  {number} playerNo the player number
   * @param  {!ParameterMap} environmentParams the environment paraméter
   * @param  {!ParameterMap} playerParams the player paraméter
   * @return {?RobotModel} a new robot model
   */
  createModel (playerType, side, playerNo, environmentParams, playerParams)
  {
    const robotSpec = new SoccerBot2DSpecification(side, playerNo);
    return new SoccerBot2D('SoccerBot2D', robotSpec, this.meshFactory, environmentParams);
  }

  /**
   * @override
   */
  dispose () {}
}

export { SoccerBot2DModelFactory };
