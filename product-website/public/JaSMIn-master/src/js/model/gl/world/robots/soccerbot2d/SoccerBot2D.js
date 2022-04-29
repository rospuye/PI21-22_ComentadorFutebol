import { DynamicRobotModel } from '../DynamicRobotModel.js';
import { SoccerBot2DSpecification } from './SoccerBot2DSpecification.js';
import { Environment2DParams, Agent2DData } from '../../../../game/utils/SServerUtil.js';
import { ParameterMap } from '../../../../game/utils/ParameterMap.js';
import { MeshFactory } from '../../../utils/MeshFactory.js';

/**
 * The SoccerBot2D class definition.
 *
 * @author Stefan Glaser
 */
class SoccerBot2D extends DynamicRobotModel
{
  /**
   * SoccerBot2D Constructor
   * 
   * @param {string} name the name of the agent model
   * @param {!SoccerBot2DSpecification} specification the soccer bot 2d specification
   * @param {!MeshFactory} meshFactory the mesh factory
   * @param {!ParameterMap} environmentParams the environment paraméter
   */
  constructor(name, specification, meshFactory, environmentParams)
  {
    super(name, specification, meshFactory);

    /**
     * The list of stamina materials.
     * @type {!Array<!THREE.Material>}
     */
    this.staminaMatList = [];

    /**
     * The maximum stamina value.
     * @type {number}
     */
    this.maxStamina = 8000;
    const maxStaminaParam = environmentParams.getNumber(Environment2DParams.STAMINA_MAX);
    if (maxStaminaParam !== null) {
      this.maxStamina = maxStaminaParam;
    }

    // Extract stamina materials
    let i = specification.staminaMaterialNames.length;
    while (i--) {
      const mat = meshFactory.materialCache[specification.staminaMaterialNames[i]];
      if (mat !== undefined) {
        this.staminaMatList.push(mat);
      }
    }
  }

  /**
   * Update the joint objects according to the given angles.
   *
   * @override
   * @param  {!Array<number> | !Float32Array} data the agent data of the current state
   * @param  {!Array<number> | !Float32Array=} nextData the agent data of the next state
   * @param  {number=} t the interpolation time
   * @return {void}
   */
  updateData (data, nextData = undefined, t = 0)
  {
    if (data[Agent2DData.STAMINA] === undefined) {
      return;
    }

    let stamina = nextData === undefined ?
          data[Agent2DData.STAMINA] :
          data[Agent2DData.STAMINA] + (nextData[Agent2DData.STAMINA] - data[Agent2DData.STAMINA]) * t;
    stamina = THREE.Math.clamp(stamina, 0, this.maxStamina);
    stamina = (this.maxStamina - stamina) / this.maxStamina;

    // Apply stamina color
    let i = this.staminaMatList.length;
    while (i--) {
      const mat = this.staminaMatList[i];
      if (mat.color.r === stamina) {
        // Prevent material updates if stamina value hasn't changed (e.g. on pausing)
        break;
      }
      mat.color.setScalar(stamina);
      mat.needsUpdate = true;
    }
  }
}

export { SoccerBot2D };
