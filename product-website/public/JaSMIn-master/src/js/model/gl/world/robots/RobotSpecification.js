/**
 *
 * @author Stefan Glaser
 */
class MeshSpecification
{
  /**
   * MeshSpecification Constructor
   *
   * @param {string} name the name of the mesh
   * @param {string} material the name of the material
   * @param {!THREE.Matrix4=} matrix the mesh transformation matrix
   */
  constructor (name, material, matrix)
  {
    /**
     * The name of the mesh.
     * @type {string}
     */
    this.name = name;

    /**
     * The name of the material.
     * @type {string}
     */
    this.material = material;

    /**
     * The name of the material.
     * @type {!THREE.Matrix4}
     */
    this.matrix = matrix !== undefined ? matrix : new THREE.Matrix4();
  }
}

export { MeshSpecification };


/**
 *
 * @author Stefan Glaser
 */
class BodyPartSpecification
{
  /**
   * BodyPartSpecification Constructor
   *
   * @param {string} name the name of the body part
   * @param {!Array<!MeshSpecification>} meshes the list of mesh specifications representing this body part
   * @param {!THREE.Vector3} translation the translation from the parent body part to this body part
   * @param {!THREE.Vector3} jointAxis the rotation axis of the joint attached to this body part
   * @param {!Array<!BodyPartSpecification>} children the child body parts
   */
  constructor (name, meshes, translation, jointAxis, children)
  {
    /**
     * The name of the body part.
     * @type {string}
     */
    this.name = name;

    /**
     * The Array of mesh specifications representing this body part.
     * @type {!Array<!MeshSpecification>}
     */
    this.meshes = meshes;

    /**
     * The translation from the parent body part to this body part.
     * @type {!THREE.Vector3}
     */
    this.translation = translation;

    /**
     * The Array of body part object names.
     * @type {!THREE.Vector3}
     */
    this.jointAxis = jointAxis;

    /**
     * The Array of child body parts.
     * @type {!Array<!BodyPartSpecification>}
     */
    this.children = children;
  }
}

export { BodyPartSpecification };


/**
 *
 * @author Stefan Glaser
 */
class RobotSpecification
{
  /**
   * RobotSpecification Constructor
   *
   * @param {string} name the name of the root body part
   * @param {!Array<string>=} teamMaterialNames the names of the team materials
   * @param {!Array<!MeshSpecification>=} meshes the list of mesh specifications representing this body part
   * @param {!Array<!BodyPartSpecification>=} children the child body parts
   */
  constructor (name, teamMaterialNames, meshes, children)
  {
    /**
     * The name of the root body part.
     * @type {string}
     */
    this.name = name;

    /**
     * The names of the team materials.
     * @type {!Array<string>}
     */
    this.teamMaterialNames = teamMaterialNames !== undefined ? teamMaterialNames : [];

    /**
     * The Array of mesh specifications representing the root body part.
     * @type {!Array<!MeshSpecification>}
     */
    this.meshes = meshes !== undefined ? meshes : [];

    /**
     * The Array of child body parts.
     * @type {!Array<!BodyPartSpecification>}
     */
    this.children = children !== undefined ? children : [];
  }
}

export { RobotSpecification };
