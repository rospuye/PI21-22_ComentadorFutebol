import { GeometryFactory } from './GeometryFactory.js';
import { MaterialFactory } from './MaterialFactory.js';
import { SceneUtil } from '../../../utils/SceneUtil.js';

/** 
 * 
 * @author Stefan Glaser
 */
class MeshFactory
{
  /**
   * MeshFactory Constructor
   *
   * @param {!GeometryFactory} geometryFactory the geometry factory to use
   * @param {!MaterialFactory} materialFactory the material factory to use
   */
  constructor (geometryFactory, materialFactory)
  {
    /**
     * The geometry factory.
     * @type {!GeometryFactory}
     */
    this.geometryFactory = geometryFactory;

    /**
     * The material factory.
     * @type {!MaterialFactory}
     */
    this.materialFactory = materialFactory;

    /**
     * Geometry cache.
     * @type {!Object}
     */
    this.geometryCache = {};

    /**
     * Material cache.
     * @type {!Object}
     */
    this.materialCache = {};

    /**
     * Let created meshes cast shadow.
     * @type {boolean}
     */
    this.castShadow = true;

    /**
     * Let created meshes receive shadow.
     * @type {boolean}
     */
    this.receiveShadow = true;
  }

  /**
   * Clear the internal cache.
   *
   * @return {void}
   */
  clearCache ()
  {
    this.geometryCache = {};
    this.materialCache = {};
  }

  /**
   * Create a mesh with the given name.
   * This method will call the GeometryFactory for a geometry with the given mesh name appended with 'Geo'.
   * If such a geometry exists, it creates a new mesh with the requested geometry and material.
   *
   * @param  {string} name the unique name of the geometry
   * @param  {string} materialName the unique name of the the material to use
   * @param  {!THREE.Matrix4} matrix the mesh matrix
   * @param  {!Function} onLoad the callback function to call on successfull creation
   * @param  {!Function=} onError the callback function to call when creating the mesh failed
   * @return {void}
   */
  createMesh (name, materialName, matrix, onLoad, onError)
  {
    const geometryName = name + 'Geo';

    // Fetch material
    const material = this.fetchMaterial(materialName);

    // Check if geometry is already cached
    if (this.geometryCache[geometryName] !== undefined) {
      // Directly create the requested mesh object with cached geometry
      const mesh = new THREE.Mesh(this.geometryCache[geometryName], material);
      mesh.name = name;
      mesh.castShadow = this.castShadow;
      mesh.receiveShadow = this.receiveShadow;
      mesh.applyMatrix(matrix);

      onLoad(mesh);
    } else {
      const scope = this;

      // Try to create the requested geometry
      this.geometryFactory.createGeometry(geometryName,
        function(newGeometry) { // onLoad
          scope.geometryCache[geometryName] = newGeometry;

          // Create the mesh object
          const mesh = new THREE.Mesh(newGeometry, material);
          mesh.name = name;
          mesh.castShadow = scope.castShadow;
          mesh.receiveShadow = scope.receiveShadow;
          mesh.applyMatrix(matrix);

          onLoad(mesh);
        },
        onError);
    }
  }

  /**
   * Fetch the material with the given name.
   *
   * @return {!THREE.Mesh} the dummy mesh
   */
  createDummyMesh ()
  {
    return SceneUtil.createDummyMesh();
  }

  /**
   * Fetch the material with the given name.
   *
   * @param  {string} name the unique name of the material
   * @return {(!THREE.Material | !Array<!THREE.Material>)} the requested material
   */
  fetchMaterial (name)
  {
    // Try fetching material from cache
    let material = this.materialCache[name];

    if (material === undefined) {
      // Create the requested material if not yet present
      material = this.materialFactory.createMaterial(name);
      this.materialCache[name] = material;
    }

    return material;
  }
}

export { MeshFactory };