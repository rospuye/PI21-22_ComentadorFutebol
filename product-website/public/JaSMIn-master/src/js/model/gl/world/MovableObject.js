import { ObjectState } from '../../game/ObjectState.js';
import { SceneUtil } from '../../../utils/SceneUtil.js';

/**
 * The MovableObject class definition.
 *
 * The MovableObject provides
 *
 * @author Stefan Glaser / http://chaosscripting.net
 */
class MovableObject
{
  /**
   * MovableObject Constructor
   *
   * @param {string} name the name of the movable object
   */
  constructor (name)
  {
    /**
     * The movable object group.
     * @type {!THREE.Object3D}
     */
    this.objGroup = new THREE.Object3D();
    this.objGroup.name = name;

    /**
     * The movable ground 2D object group.
     * @type {!THREE.Object3D}
     */
    this.objTwoDGroup = new THREE.Object3D();
    this.objTwoDGroup.name = name + '_2D';

    /**
     * The object representing that this object is selected.
     * @type {!THREE.Mesh}
     */
    this.selectionObj = SceneUtil.createSelectionMesh(0.15, 0.02);
    this.objTwoDGroup.add(this.selectionObj);
  }

  /**
   * Highlight or normalize object representation.
   *
   * @param {boolean} selected true for selected, false for deseleced
   */
  setSelected (selected)
  {
    this.selectionObj.visible = selected;
  }

  /**
   * [updateBodyPose description]
   *
   * @param  {!ObjectState} state the current object state
   * @param  {!ObjectState=} nextState the next object state
   * @param  {number=} t the interpolated time between the current and next state
   * @return {void}
   */
  updateBodyPose (state, nextState = undefined, t = 0)
  {
    // Update position and orientation of this root object group
    if (nextState !== undefined && nextState.isValid() && t > 0) {
      if (t >= 1) {
        this.objGroup.position.set(nextState.x, nextState.y, nextState.z);
        this.objGroup.quaternion.set(nextState.qx, nextState.qy, nextState.qz, nextState.qw);
      } else {
        this.objGroup.position.lerpVectors(state.position, nextState.position, t);
        THREE.Quaternion.slerp(state.orientation, nextState.orientation, this.objGroup.quaternion, t);
      }
    } else {
      this.objGroup.position.set(state.x, state.y, state.z);
      this.objGroup.quaternion.set(state.qx, state.qy, state.qz, state.qw);
    }

    // Copy 2D position and orientation to 2D object group
    this.objTwoDGroup.position.x = this.objGroup.position.x;
    this.objTwoDGroup.position.z = this.objGroup.position.z;
    // DOTO: extract heading angle

    // Trigger update of object matrices
    this.objGroup.updateMatrix();
    this.objTwoDGroup.updateMatrix();
  }
}

export { MovableObject };
