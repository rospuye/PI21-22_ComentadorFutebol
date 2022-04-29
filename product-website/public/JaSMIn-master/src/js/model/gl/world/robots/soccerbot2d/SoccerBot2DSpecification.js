import { RobotSpecification, BodyPartSpecification, MeshSpecification } from '../RobotSpecification.js';
import { GeometryFactory } from '../../../utils/GeometryFactory.js';
import { MaterialFactory } from '../../../utils/MaterialFactory.js';
import { SceneUtil } from '../../../../../utils/SceneUtil.js';
import { ThreeJsUtil } from '../../../../../utils/ThreeJsUtil.js';
import { TeamSide, GameUtil } from '../../../../game/utils/GameUtil.js';

/**
 * The SoccerBot2DSpecification definition.
 *
 * @author Stefan Glaser
 */
class SoccerBot2DSpecification extends RobotSpecification
{
  /**
   * SoccerBot2DSpecification Constructor
   *
   * @param {!TeamSide} side the team side
   * @param {number} playerNo the player number
   */
  constructor (side, playerNo)
  {
    super('torso');

    const sideLetter = GameUtil.getSideLetter(side);
    const matStamina = 'stamina_' + sideLetter + playerNo;
    const matBlack = 'sbBlack';
    const matBlue = 'sbBlue';
    const matTeam = side === TeamSide.LEFT ? 'teamLeft' : 'teamRight';
    this.teamMaterialNames.push(matTeam);

    const m4Body = ThreeJsUtil.mM4(1, 0, 0, 0, 0, 1, 0, 0.3, 0, 0, 1, 0);
    const m4Team = ThreeJsUtil.mM4(1, 0, 0, 0, 0, 0.2, 0, 0.6, 0, 0, 1, 0);
    const m4Stamina = ThreeJsUtil.mM4(-1, 0, 0, 0, 0, 0.2, 0, 0.6, 0, 0, -1, 0);
    const m4Nose = ThreeJsUtil.mM4(1, 0, 0, 0.25, 0, 1, 0, 0, 0, 0, 1, 0);

    /**
     * The list of stamina material names.
     * @type {!Array<string>}
     */
    this.staminaMaterialNames = [matStamina];

    // torso meshes
    this.meshes.push(new MeshSpecification('bodyCylinder', matBlack, m4Body));
    this.meshes.push(new MeshSpecification('bodyTeamSphere', matTeam, m4Team));
    this.meshes.push(new MeshSpecification('bodyStaminaSphere', matStamina, m4Stamina));

    // Head
    this.children.push(
        new BodyPartSpecification('head',
          [ // head meshes
            new MeshSpecification('headCylinder', matBlue),
            new MeshSpecification('headNoseBox', matBlue, m4Nose)
          ],
          new THREE.Vector3(0, 0.651, 0),
          ThreeJsUtil.Vector3_UnitY(),
          [])); // No further children here
  }
}

export { SoccerBot2DSpecification };



/**
 * The material factory for the soccer bot 2D robot models.
 *
 * @author Stefan Glaser
 */
class SoccerBot2DMaterialFactory extends MaterialFactory
{
  /**
   * Create the material with the given name.
   *
   * @override
   * @param  {string} name the unique name of the material
   * @return {(!THREE.Material | !Array<!THREE.Material>)} the requested (multi-)material
   *                             or a default material if the requested material definition was not found
   */
  createMaterial (name)
  {
    switch (name) {
      case 'sbBlue':
        return SceneUtil.createStdPhongMat(name, 0x001166);
        break;
      case 'sbBlack':
        return SceneUtil.createStdPhongMat(name, 0x000000);
        break;
      default:
        // By default create a very dark grey material
        return SceneUtil.createStdPhongMat(name, 0x111111);
        break;
    }
  }
}

export { SoccerBot2DMaterialFactory };



/**
 * The geometry factory for the soccer bot 2D robot models.
 *
 * @author Stefan Glaser
 */
class SoccerBot2DGeometryFactory extends GeometryFactory
{
  /**
   * Create the geometry with the given name.
   *
   * @override
   * @param  {string} name the unique name of the geometry
   * @param  {!Function} onLoad the callback function to call on successfull creation
   * @param  {!Function=} onError the callback function to call when creating the geometry failed
   * @return {void}
   */
  createGeometry (name, onLoad, onError)
  {
      switch (name) {
      case 'bodyCylinderGeo':
        onLoad(new THREE.CylinderBufferGeometry(0.5, 0.5, 0.6, 32));
        break;
      case 'bodyTeamSphereGeo':
        onLoad(new THREE.SphereBufferGeometry(0.44, 16, 4, Math.PI / 2, Math.PI, 0, Math.PI / 2));
        break;
      case 'bodyStaminaSphereGeo':
        onLoad(new THREE.SphereBufferGeometry(0.44, 16, 4, Math.PI / 2, Math.PI, 0, Math.PI / 2));
        break;
      case 'headCylinderGeo':
        onLoad(new THREE.CylinderBufferGeometry(0.1, 0.1, 0.1, 16));
        break;
      case 'headNoseBoxGeo':
        onLoad(new THREE.BoxBufferGeometry(0.5, 0.1, 0.1));
        break;
      default:
        // Log error
        console.log('Geometry "' + name + '" not found!');

        if (onError) {
          onError('Geometry "' + name + '" not found!');
        }
        break;
      }
  }
}

export { SoccerBot2DGeometryFactory };
