import { MaterialFactory } from '../../../utils/MaterialFactory.js';
import { JSONGeometryFactory } from '../../../utils/JSONGeometryFactory.js';
import { RobotSpecification, BodyPartSpecification, MeshSpecification } from '../RobotSpecification.js';
import { SceneUtil } from '../../../../../utils/SceneUtil.js';
import { ThreeJsUtil } from '../../../../../utils/ThreeJsUtil.js';
import { TeamSide } from '../../../../game/utils/GameUtil.js';

/**
 * The NaoSpecification interface definition.
 *
 * The NaoSpecification describes the API of an agent bundle.
 *
 * @author Stefan Glaser
 */
class NaoSpecification extends RobotSpecification
{
  /**
   * NaoSpecification Constructor
   * 
   * @param {!TeamSide} side the team side
   * @param {number} type the nao hetero model type
   * @param {number} playerNo the player number
   */
  constructor(side, type, playerNo)
  {
    super('torso');

    const matNum = 'num' + playerNo;
    const matWhite = NaoMaterialNames.NAO_WHITE;
    const matBlack = NaoMaterialNames.NAO_BLACK;
    const matGrey = NaoMaterialNames.NAO_GREY;
    const matTeam = side === TeamSide.LEFT ? NaoMaterialNames.NAO_TEAM_LEFT : NaoMaterialNames.NAO_TEAM_RIGHT;
    this.teamMaterialNames.push(matTeam);

    const m4Torso = ThreeJsUtil.mM4(0, 0, 0.1, 0, 0, 0.1, 0, 0, -0.1, 0, 0, 0);
    const m4lUpperArm = ThreeJsUtil.mM4(0, 0.07, 0, 0.02, 0, 0, 0.07, 0, 0.07, 0, 0, -0.01);
    const m4rUpperArm = ThreeJsUtil.mM4(0, 0.07, 0, 0.02, 0, 0, 0.07, 0, 0.07, 0, 0, 0.01);
    const m4LowerArm = ThreeJsUtil.mM4(0, 0.05, 0, 0.05, 0, 0, 0.05, 0, 0.05, 0, 0, 0);
    const m4Thigh = ThreeJsUtil.mM4(0, 0.07, 0, 0.01, 0, 0, 0.07, -0.04, 0.07, 0, 0, 0);
    const m4Shank = ThreeJsUtil.mM4(0, 0.08, 0, -0.005, 0, 0, 0.08, -0.055, 0.08, 0, 0, 0);
    const m4Foot = ThreeJsUtil.mM4(0, 0.08, 0, 0.03, 0, 0, 0.08, -0.04, 0.08, 0, 0, 0);

    // torso meshes
    this.meshes.push(new MeshSpecification('nao_torso_coreBody', matWhite, m4Torso));
    this.meshes.push(new MeshSpecification('nao_torso_coreInner', matBlack, m4Torso));
    this.meshes.push(new MeshSpecification('nao_torso_chestButton', matTeam, m4Torso));
    this.meshes.push(new MeshSpecification('nao_torso_chestBow', matTeam, m4Torso));
    this.meshes.push(new MeshSpecification('nao_torso_numberBatch', matNum, m4Torso));
    this.meshes.push(new MeshSpecification('nao_torso_lCollar', matWhite, ThreeJsUtil.mM4(0, 0, -0.1, 0, 0, 0.1, 0, 0, 0.1, 0, 0, 0)));
    this.meshes.push(new MeshSpecification('nao_torso_rCollar', matWhite, m4Torso));

    // Head
    this.children.push(
        new BodyPartSpecification('neck',
          [], // neck meshes
          new THREE.Vector3(0, 0.09, 0),
          ThreeJsUtil.Vector3_UnitY(),
          [ // neck children
            new BodyPartSpecification('head',
              [ // head meshes
                new MeshSpecification('nao_head_core', matWhite, m4Torso),
                new MeshSpecification('nao_head_ears', matGrey, m4Torso),
                new MeshSpecification('nao_head_teamMarker', matTeam, m4Torso),
                new MeshSpecification('nao_head_camera', matBlack, m4Torso)
              ],
              new THREE.Vector3(0, 0.06, 0),
              ThreeJsUtil.Vector3_UnitZ(),
              []) // No further children here
          ]));

    // Right arm
    this.children.push(
        new BodyPartSpecification('rShoulder',
          [], // rShoulder meshes
          new THREE.Vector3(0, 0.075, 0.098),
          ThreeJsUtil.Vector3_UnitZ(),
          [ // rShoulder children
            new BodyPartSpecification('rUpperArm',
              [ // rUpperArm meshes
                new MeshSpecification('nao_rUpperArm_cylinder', matBlack, m4rUpperArm),
                new MeshSpecification('nao_rUpperArm_protector', matWhite, m4rUpperArm),
                new MeshSpecification('nao_rUpperArm_teamMarker', matTeam, m4rUpperArm)
              ],
              ThreeJsUtil.Vector3_Zero(),
              ThreeJsUtil.Vector3_UnitY(),
              [ // rUpperArm children
                new BodyPartSpecification('rElbow',
                  [], // rElbow meshes
                  new THREE.Vector3(0.09, 0.009, 0),
                  ThreeJsUtil.Vector3_UnitX(),
                  [ // rElbow children
                    new BodyPartSpecification('rLowerArm',
                      [ // rLowerArm meshes
                        new MeshSpecification('nao_rLowerArm_core', matWhite, m4LowerArm),
                        new MeshSpecification('nao_rLowerArm_teamMarker', matTeam, m4LowerArm)
                      ],
                      ThreeJsUtil.Vector3_Zero(),
                      ThreeJsUtil.Vector3_UnitY(),
                      []) // No further children here
                  ])
              ])
          ]));

    // Left arm
    this.children.push(
        new BodyPartSpecification('lShoulder',
          [], // lShoulder meshes
          new THREE.Vector3(0, 0.075, -0.098),
          ThreeJsUtil.Vector3_UnitZ(),
          [ // lShoulder children
            new BodyPartSpecification('lUpperArm',
              [ // lUpperArm meshes
                new MeshSpecification('nao_lUpperArm_cylinder', matBlack, m4lUpperArm),
                new MeshSpecification('nao_lUpperArm_protector', matWhite, m4lUpperArm),
                new MeshSpecification('nao_lUpperArm_teamMarker', matTeam, m4lUpperArm)
              ],
              ThreeJsUtil.Vector3_Zero(),
              ThreeJsUtil.Vector3_UnitY(),
              [ // lUpperArm children
                new BodyPartSpecification('lElbow',
                  [], // lElbow meshes
                  new THREE.Vector3(0.09, 0.009, 0),
                  ThreeJsUtil.Vector3_UnitX(),
                  [ // lElbow children
                    new BodyPartSpecification('lLowerArm',
                      [ // lLowerArm meshes
                        new MeshSpecification('nao_lLowerArm_core', matWhite, m4LowerArm),
                        new MeshSpecification('nao_lLowerArm_teamMarker', matTeam, m4LowerArm)
                      ],
                      ThreeJsUtil.Vector3_Zero(),
                      ThreeJsUtil.Vector3_UnitY(),
                      []) // No further children here
                  ])
              ])
          ]));

    // Right leg
    this.children.push(
        new BodyPartSpecification('rHip1',
          [], // rHip1 meshes
          new THREE.Vector3(-0.01, -0.115, 0.055),
          new THREE.Vector3(0, 0.7071, -0.7071),
          [ // rHip1 children
            new BodyPartSpecification('rHip2',
              [], // rHip2 meshes
              ThreeJsUtil.Vector3_Zero(),
              ThreeJsUtil.Vector3_UnitX(),
              [ // rHip2 children
                new BodyPartSpecification('rThigh',
                  [ // rThigh meshes
                    new MeshSpecification('nao_rThigh_core', matWhite, m4Thigh),
                    new MeshSpecification('nao_rThigh_teamMarker', matTeam, m4Thigh),
                    new MeshSpecification('nao_rThigh_noMarker', matNum, m4Thigh)
                  ],
                  ThreeJsUtil.Vector3_Zero(),
                  ThreeJsUtil.Vector3_UnitZ(),
                  [ // rThigh children
                    new BodyPartSpecification('rShank',
                      [ // rShank meshes
                        new MeshSpecification('nao_rShank_coreInner', matBlack, m4Shank),
                        new MeshSpecification('nao_rShank_coreBody', matWhite, m4Shank),
                        new MeshSpecification('nao_rShank_teamMarker', matTeam, m4Shank)
                      ],
                      new THREE.Vector3(0.005, -0.12, 0),
                      ThreeJsUtil.Vector3_UnitZ(),
                      [ // rShank children
                        new BodyPartSpecification('rAnkle',
                          [], // rAnkle meshes
                          new THREE.Vector3(0, -0.1, 0),
                          ThreeJsUtil.Vector3_UnitZ(),
                          [ // rAnkle children
                            new BodyPartSpecification('rFoot',
                              [ // rFoot meshes
                                new MeshSpecification('nao_rFoot_core', matWhite, m4Foot),
                                new MeshSpecification('nao_rFoot_teamMarker', matTeam, m4Foot)
                              ],
                              ThreeJsUtil.Vector3_Zero(),
                              ThreeJsUtil.Vector3_UnitX(),
                              []) // No further children here
                          ])
                      ])
                  ])
              ])
          ]));

    // Left leg
    this.children.push(
        new BodyPartSpecification('lHip1',
          [], // lHip1 meshes
          new THREE.Vector3(-0.01, -0.115, -0.055),
          new THREE.Vector3(0, -0.7071, -0.7071),
          [ // lHip1 children
            new BodyPartSpecification('lHip2',
              [], // lHip2 meshes
              ThreeJsUtil.Vector3_Zero(),
              ThreeJsUtil.Vector3_UnitX(),
              [ // lHip2 children
                new BodyPartSpecification('lThigh',
                  [ // lThigh meshes
                    new MeshSpecification('nao_lThigh_core', matWhite, m4Thigh),
                    new MeshSpecification('nao_lThigh_teamMarker', matTeam, m4Thigh)
                  ],
                  ThreeJsUtil.Vector3_Zero(),
                  ThreeJsUtil.Vector3_UnitZ(),
                  [ // lThigh children
                    new BodyPartSpecification('lShank',
                      [ // lShank meshes
                        new MeshSpecification('nao_lShank_coreInner', matBlack, m4Shank),
                        new MeshSpecification('nao_lShank_coreBody', matWhite, m4Shank),
                        new MeshSpecification('nao_lShank_teamMarker', matTeam, m4Shank)
                      ],
                      new THREE.Vector3(0.005, -0.12, 0),
                      ThreeJsUtil.Vector3_UnitZ(),
                      [ // lShank children
                        new BodyPartSpecification('lAnkle',
                          [], // lAnkle meshes
                          new THREE.Vector3(0, -0.1, 0),
                          ThreeJsUtil.Vector3_UnitZ(),
                          [ // lAnkle children
                            new BodyPartSpecification('lFoot',
                              [ // lFoot meshes
                                new MeshSpecification('nao_lFoot_core', matWhite, m4Foot),
                                new MeshSpecification('nao_lFoot_teamMarker', matTeam, m4Foot)
                              ],
                              ThreeJsUtil.Vector3_Zero(),
                              ThreeJsUtil.Vector3_UnitX(),
                              []) // No further children here
                          ])
                      ])
                  ])
              ])
          ]));

    /**
     * The nao hetero model type.
     * @type {number}
     */
    this.type = type !== undefined ? type : 0;

    // Apply type specific modifications
    switch (this.type) {
      case 4:
        this.applyType4Modifications();
        break;
      case 3:
        this.applyType3Modifications();
        break;
      case 1:
        this.applyType1Modifications();
        break;
      default:
        break;
    }
  }

  /**
   * Change the default model to a type 1 model.
   *
   * @return {void}
   */
  applyType1Modifications ()
  {
    const rElbow = this.children[1].children[0].children[0];
    const lElbow = this.children[2].children[0].children[0];

    rElbow.translation.x = 0.12664;
    lElbow.translation.x = 0.12664;

    const rShank = this.children[3].children[0].children[0].children[0];
    const lShank = this.children[4].children[0].children[0].children[0];

    rShank.translation.y = -0.13832;
    lShank.translation.y = -0.13832;

    const rAnkle = rShank.children[0];
    const lAnkle = lShank.children[0];

    rAnkle.translation.y = -0.11832;
    lAnkle.translation.y = -0.11832;
  }

  /**
   * Change the default model to a type 3 model.
   *
   * @return {void}
   */
  applyType3Modifications ()
  {
    const rElbow = this.children[1].children[0].children[0];
    const lElbow = this.children[2].children[0].children[0];

    rElbow.translation.x = 0.145736848;
    lElbow.translation.x = 0.145736848;

    const rHip1 = this.children[3];
    const lHip1 = this.children[4];

    rHip1.translation.z = 0.072954143;
    lHip1.translation.z = -0.072954143;

    const rShank = lHip1.children[0].children[0].children[0];
    const lShank = rHip1.children[0].children[0].children[0];

    rShank.translation.y = -0.147868424;
    lShank.translation.y = -0.147868424;

    const rAnkle = rShank.children[0];
    const lAnkle = lShank.children[0];

    rAnkle.translation.y = -0.127868424;
    lAnkle.translation.y = -0.127868424;
  }

  /**
   * Change the default model to a type 4 model.
   *
   * @return {void}
   */
  applyType4Modifications ()
  {
    const rFoot = this.children[3].children[0].children[0].children[0].children[0].children[0];
    const lFoot = this.children[4].children[0].children[0].children[0].children[0].children[0];

    rFoot.children.push(
      new BodyPartSpecification('rToe',
        [ // lToe meshes
        ],
        new THREE.Vector3(0.06, -0.04, 0),
        ThreeJsUtil.Vector3_UnitZ(),
        []) // No further children here);
      );

    lFoot.children.push(
      new BodyPartSpecification('lToe',
        [ // lToe meshes
        ],
        new THREE.Vector3(0.06, -0.04, 0),
        ThreeJsUtil.Vector3_UnitZ(),
        []) // No further children here);
      );
  }
}

export { NaoSpecification };















/**
 * An enum providing the available materials.
 * @enum {string}
 */
export const NaoMaterialNames = {
  NAO_WHITE: 'naoWhite',
  NAO_BLACK: 'naoBlack',
  NAO_GREY: 'naoGrey',
  NAO_TEAM_LEFT: 'teamLeft',
  NAO_TEAM_RIGHT: 'teamRight'
};




/**
 * The material factory for the nao robot models.
 *
 * @author Stefan Glaser
 */
class NaoMaterialFactory extends MaterialFactory
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
    if (name.startsWith('num')) {
      let number = 0;
      try {
        number = parseInt(name.slice(3), 10);
      } catch (err) {
      }

      return SceneUtil.createStdNumberMat(name, 0xcccccc, number);
    }

    switch (name) {
      case NaoMaterialNames.NAO_BLACK:
        return SceneUtil.createStdPhongMat(name, 0x000000);
        break;
      case NaoMaterialNames.NAO_GREY:
        return SceneUtil.createStdPhongMat(name, 0x3d3d3d);
        break;
      case NaoMaterialNames.NAO_WHITE:
        return SceneUtil.createStdPhongMat(name, 0xcccccc);
        break;
      default:
        // By default create a clone of nao white materail
        return SceneUtil.createStdPhongMat(name, 0x3d3d3d);
        break;
    }
  }
}

export { NaoMaterialFactory };
