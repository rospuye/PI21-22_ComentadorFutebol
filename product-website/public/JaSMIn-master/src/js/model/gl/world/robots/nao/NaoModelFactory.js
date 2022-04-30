import { RobotModelFactory } from '../RobotModelFactory.js';
import { DynamicRobotModel } from '../DynamicRobotModel.js';
import { JSONGeometryFactory } from '../../../utils/JSONGeometryFactory.js';
import { MeshFactory } from '../../../utils/MeshFactory.js';
import { NaoSpecification, NaoMaterialFactory } from './NaoSpecification.js';
import { PlayerType3DParams } from '../../../../game/utils/SparkUtil.js';

/**
 *
 * @author Stefan Glaser
 */
class NaoModelFactory extends RobotModelFactory
{
  /**
   * NaoModelFactory Constructor
   */
  constructor()
  {
    super();

    /**
     * The mesh factory.
     * @type {!MeshFactory}
     */
    this.meshFactory = new MeshFactory(new JSONGeometryFactory('models/nao_bundle.json'), new NaoMaterialFactory());
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
    const modelName = playerType.getString(PlayerType3DParams.MODEL_NAME);

    if (modelName !== null && modelName.slice(0, 3) === 'nao') {
      let modelType = playerType.getNumber(PlayerType3DParams.MODEL_TYPE);

      if (modelType === null) {
        modelType = 0;
      }

      const specification = new NaoSpecification(side, modelType, playerNo);
      return new DynamicRobotModel('nao_hetero', specification, this.meshFactory);
    }

    return null;
  }

  /**
   * @override
   */
  dispose () {}
}

export { NaoModelFactory };
