import { RobotModel } from '../RobotModel.js';
import { SceneUtil } from '../../../../utils/SceneUtil.js';
import { MeshFactory } from '../../utils/MeshFactory.js';
import { RobotSpecification, BodyPartSpecification } from './RobotSpecification.js';

/**
 * The DynamicRobotModel class definition.
 *
 * @author Stefan Glaser
 */
class DynamicRobotModel extends RobotModel
{
  /**
   * DynamicRobotModel Constructor
   *
   * @param {string} name the name of the agent model
   * @param {!RobotSpecification} specification the dynamic model specification
   * @param {!MeshFactory} meshFactory the mesh factory
   */
  constructor (name, specification, meshFactory)
  {
    super(name);

    // Create model gl representation based on model specification
    this.createModel(specification, meshFactory);
  }

  /**
   * Create a robot model to the given name.
   *
   * @param {!RobotSpecification} spec the robot specification
   * @param {!MeshFactory} meshFactory the mesh factory
   * @return {void}
   */
  createModel (spec, meshFactory)
  {
    let i = 0;

    // Create root body
    const rootBody = new THREE.Object3D();
    rootBody.name = spec.name;
    this.objGroup.add(rootBody);

    if (spec.meshes.length > 0) {
      // Create placeholder
      const placeholder = meshFactory.createDummyMesh();
      rootBody.add(placeholder);

      const onLoaded = function() {
        const body = rootBody;
        const ph = placeholder;

        return function(mesh) {
          body.remove(ph);
          body.add(mesh);
        };
      }();

      // Create meshes
      i = spec.meshes.length;
      while (i--) {
        meshFactory.createMesh(spec.meshes[i].name, spec.meshes[i].material, spec.meshes[i].matrix, onLoaded);
      }
    }

    // Create child body parts
    for (i = 0; i < spec.children.length; ++i) {
      rootBody.add(this.createBodyParts(spec.children[i], meshFactory));
    }

    // Extract team materials
    i = spec.teamMaterialNames.length;
    while (i--) {
      const mat = meshFactory.materialCache[spec.teamMaterialNames[i]];
      if (mat !== undefined) {
        this.teamMatList.push(mat);
      }
    }
  }

  /**
   * Create a body part hierarchy according to the given specification.
   *
   * @param {!BodyPartSpecification} specification the body part specification
   * @param {!MeshFactory} meshFactory the mesh factory
   * @return {!THREE.Object3D} an object representing this body part
   */
  createBodyParts (specification, meshFactory)
  {
    let i = 0;
    const bodyGroup = new THREE.Object3D();
    bodyGroup.name = specification.name;
    this.jointGroups.push(bodyGroup);

    // Set body part data
    bodyGroup.position.copy(specification.translation);
    bodyGroup.jointAxis = specification.jointAxis;

    if (specification.meshes.length > 0) {
      // Create placeholder
      const placeholder = SceneUtil.createDummyMesh();
      bodyGroup.add(placeholder);

      const onLoaded = function() {
        const body = bodyGroup;
        const ph = placeholder;

        return function(mesh) {
          body.remove(ph);
          body.add(mesh);
        };
      }();

      // Create meshes
      i = specification.meshes.length;
      while (i--) {
        meshFactory.createMesh(specification.meshes[i].name, specification.meshes[i].material, specification.meshes[i].matrix, onLoaded);
      }
    }

    // Create child body parts
    for (i = 0; i < specification.children.length; ++i) {
      bodyGroup.add(this.createBodyParts(specification.children[i], meshFactory));
    }

    return bodyGroup;
  }
}

export { DynamicRobotModel };
