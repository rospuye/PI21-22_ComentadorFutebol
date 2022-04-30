import { MeshFactory } from '../../utils/MeshFactory.js';
import { SceneUtil } from '../../../../utils/SceneUtil.js';
import { Field } from '../Field.js';
import { Ball } from '../Ball.js';

/**
 *
 * @author Stefan Glaser
 */
class WorldModelFactory
{
  /**
   * WorldModelFactory Constructor
   */
  constructor()
  {
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
  }

  /**
   * Dispose all resources allocated within this factory.
   *
   * @return {void}
   */
  dispose () {}

  /**
   * Create a default world representation (sky box and lighting).
   *
   * @param  {!THREE.Scene} scene the world scene
   * @return {void}
   */
  createScene (scene)
  {
    // Create sky box
    const geometry = this.fetchGeometry('skyBoxGeo');
    const material = this.fetchMaterial('skyBoxMat');

    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = 'skyBox';
    scene.add(mesh);


    // Ambient lighting
    let light = new THREE.AmbientLight(0xeeeeee);
    light.name = 'ambient';
    scene.add(light);

    // Directional lighting
    light = new THREE.DirectionalLight(0xeeeeee, 0.4);
    light.name = 'sun';
    light.position.set(300, 300, 500);
    light.castShadow = true;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;

    scene.add(light);
  }

  /**
   * Update the scene representation (adjust shadow camera to field size).
   *
   * @param  {!THREE.Scene} scene the scene instance
   * @param  {!THREE.Vector2} fieldDimensions the field dimensions
   * @return {void}
   */
  updateScene (scene, fieldDimensions)
  {
    // Update shadow camera of "sun" DirectionalLight
    const light = scene.getObjectByName('sun');
    if (light instanceof THREE.DirectionalLight) {
      const vertical = Math.ceil(fieldDimensions.y * 0.8);
      const horizontal = Math.ceil(fieldDimensions.x * 0.7);
      const depth = fieldDimensions.y;

      light.shadow.camera.left = -horizontal;
      light.shadow.camera.right = horizontal;
      light.shadow.camera.top = vertical;
      light.shadow.camera.bottom = -vertical;
      light.shadow.camera.near = 655 - depth;
      light.shadow.camera.far = 655 + depth;
      light.shadow.camera.updateProjectionMatrix();
    }
  }

  /**
   * Update the field representation for the given field instance.
   * This function repositions and rescales all objects on the field (field plane, border, field lines and goals)
   * to match their specification.
   *
   * @param  {!Field} field the field instance
   * @return {void}
   */
  updateField (field)
  {
    const size = field.fieldDimensions;
    let geometry;
    let mesh;
    const scope = this;

    /**
     * Helper function...
     * @param {string} name the name of the new mesh
     * @param {string} matName the name of the material to use
     * @param {string=} geoName the name of the geometry to use
     */
    const addMesh = function (name, matName, geoName) {
      const material = scope.fetchMaterial(matName);
      if (geoName) {
        geometry = scope.fetchGeometry(geoName);
      }

      mesh = new THREE.Mesh(geometry, material);
      mesh.name = name;
      mesh.rotation.x = -Math.PI / 2;
      mesh.receiveShadow = true;
      mesh.castShadow = false;
      field.objGroup.add(mesh);
    };


    let halfLength = Math.floor((size.x + 1.99) / 2);

    // ---------- Update field plane
    mesh = field.objGroup.getObjectByName('fieldPlane');
    if (!mesh) {
      // No fieldPlane found, thus create new one
      addMesh('fieldPlane', 'grassMat', 'planeGeo');
    }

    // Resize field plane
    mesh.scale.set(halfLength * 2, size.y, 1);
    if (field.textureRepeat !== null) {
      mesh.material.map.repeat.set(field.textureRepeat, field.textureRepeat * size.y / size.x);
    } else {
      mesh.material.map.repeat.set(halfLength, size.y);
    }
    mesh.material.needsUpdate = true;



    halfLength = size.x / 2;
    const halfWidth = size.y / 2;
    const borderSize = size.x / 12;

    // ---------- Update field top border
    mesh = field.objGroup.getObjectByName('fieldBorderTop');
    if (!mesh) {
      // No top border found, thus create new one
      addMesh('fieldBorderTop', 'tbBorderMat', 'planeGeo');
    }

    // Adjust top border
    mesh.scale.set(size.x + borderSize * 2, borderSize, 1);
    mesh.position.set(0, 0, -halfWidth - borderSize / 2);
    mesh.material.map.repeat.set((size.x + borderSize * 2), borderSize);
    mesh.material.needsUpdate = true;


    // ---------- Update field bottom border
    mesh = field.objGroup.getObjectByName('fieldBorderBottom');
    if (!mesh) {
      // No bottom border found, thus create new one
      addMesh('fieldBorderBottom', 'tbBorderMat', 'planeGeo');
    }

    // Adjust bottom border
    mesh.scale.set(size.x + borderSize * 2, borderSize, 1);
    mesh.position.set(0, 0, halfWidth + borderSize / 2);
    mesh.material.map.repeat.set((size.x + borderSize * 2), borderSize);
    mesh.material.needsUpdate = true;


    // ---------- Update field left border
    mesh = field.objGroup.getObjectByName('fieldBorderLeft');
    if (!mesh) {
      // No left border found, thus create new one
      addMesh('fieldBorderLeft', 'lrBorderMat', 'planeGeo');
    }

    // Adjust left border
    mesh.scale.set(borderSize, size.y, 1);
    mesh.position.set(-halfLength - borderSize / 2, 0, 0);
    mesh.material.map.repeat.set(borderSize, size.y);
    mesh.material.needsUpdate = true;


    // ---------- Update field right border
    mesh = field.objGroup.getObjectByName('fieldBorderRight');
    if (!mesh) {
      // No right border found, thus create new one
      addMesh('fieldBorderRight', 'lrBorderMat', 'planeGeo');
    }

    // Adjust right border
    mesh.scale.set(borderSize, size.y, 1);
    mesh.position.set(halfLength + borderSize / 2, 0, 0);
    mesh.material.map.repeat.set(borderSize, size.y);
    mesh.material.needsUpdate = true;


    // ---------- Update field lines
    mesh = field.objGroup.getObjectByName('fieldLines');
    if (mesh) {
      field.objGroup.remove(mesh);
      mesh.geometry.dispose();
    }
    geometry = SceneUtil.createFieldLinesGeometry(field.lineWidth,
                                                   field.fieldDimensions,
                                                   field.centerRadius,
                                                   field.goalAreaDimensions,
                                                   field.penaltyAreaDimensions);
    addMesh('fieldLines', 'lineMat');


    // ---------- Update goals
    this.updateGoals(field);
  }

  /**
   * Update the goal representations for the given field instance.
   * This function repositions and rescales the goal objects in the given field instance to match their specification.
   *
   * @param  {!Field} field the field instance
   * @return {void}
   */
  updateGoals (field)
  {
    const dimensions = field.goalDimensions;
    let geometry;
    let material;
    let group;
    let mesh;
    const netWidth = dimensions.y + field.lineWidth * 2 - 0.02;
    const netDepth = dimensions.x - field.lineWidth - 0.01;
    const netHeight = Math.sqrt(netDepth * netDepth + dimensions.z * dimensions.z);

    /**
     * Helper function...
     * @param {string} name the name of the new mesh
     * @param {boolean} shadow
     */
    const addMesh = function (name, shadow) {
      mesh = new THREE.Mesh(geometry, material);
      mesh.name = name;
      mesh.rotation.x = -Math.PI / 2;
      mesh.receiveShadow = shadow;
      mesh.castShadow = shadow;
      group.add(mesh);
    };

    const goalGeometry = SceneUtil.createHockeyGoalGeometry(field.lineWidth, field.goalDimensions);


    // ---------- Update left goal group
    group = field.objGroup.getObjectByName('leftGoal');
    if (!group) {
      // No left goal group found, thus create new one
      group = new THREE.Object3D();
      group.name = 'leftGoal';
      group.rotation.y = Math.PI;
      field.objGroup.add(group);
    }
    group.position.x = -field.fieldDimensions.x / 2;


    // ---------- Update left goal skeleton
    mesh = group.getObjectByName('goalSkeleton');
    if (mesh) {
      group.remove(mesh);
      mesh.geometry.dispose();
    }
    geometry = goalGeometry;
    material = this.fetchMaterial('leftGoalMat');
    addMesh('goalSkeleton', true);


    // ---------- Update left goal side nets
    mesh = group.getObjectByName('goalNetSides');
    if (!mesh) {
      // Create left/right side goal nets
      geometry = this.fetchGeometry('goalNetSidesGeo');
      material = this.fetchMaterial('goalNetSidesMat');
      addMesh('goalNetSides', false);
    }
    mesh.position.set(dimensions.x - netDepth, 0, 0);
    mesh.scale.set(netDepth, netWidth, dimensions.z);
    mesh.material.map.repeat.set(netDepth, dimensions.z);
    mesh.material.needsUpdate = true;


    // ---------- Update left goal back net
    mesh = group.getObjectByName('goalNetBack');
    if (!mesh) {
      // Create back goal net
      geometry = this.fetchGeometry('planeGeo');
      material = this.fetchMaterial('goalNetBackMat');
      addMesh('goalNetBack', false);
    }
    mesh.position.set(field.lineWidth + netDepth / 2, dimensions.z / 2, 0);
    mesh.scale.set(netWidth, netHeight, 1);
    mesh.rotation.order = 'ZYX';
    mesh.rotation.y = -Math.PI / 2;
    mesh.rotation.x = (Math.PI / 2) - Math.atan(dimensions.z / netDepth);
    mesh.material.map.repeat.set(netWidth, netHeight);
    mesh.material.needsUpdate = true;



    // ---------- Update right goal group
    group = field.objGroup.getObjectByName('rightGoal');
    if (!group) {
      // No right goal group found, thus create new one
      group = new THREE.Object3D();
      group.name = 'rightGoal';
      field.objGroup.add(group);
    }
    group.position.x = field.fieldDimensions.x / 2;


    // ---------- Update right goal skeleton
    mesh = group.getObjectByName('goalSkeleton');
    if (mesh) {
      group.remove(mesh);
      mesh.geometry.dispose();
    }
    geometry = goalGeometry;
    material = this.fetchMaterial('rightGoalMat');
    addMesh('goalSkeleton', true);


    // ---------- Update right goal side nets
    mesh = group.getObjectByName('goalNetSides');
    if (!mesh) {
      // Create left/right side goal nets
      geometry = this.fetchGeometry('goalNetSidesGeo');
      material = this.fetchMaterial('goalNetSidesMat');
      addMesh('goalNetSides', false);
    }
    mesh.position.set(dimensions.x - netDepth, 0, 0);
    mesh.scale.set(netDepth, netWidth, dimensions.z);
    mesh.material.map.repeat.set(netDepth, dimensions.z);
    mesh.material.needsUpdate = true;


    // ---------- Update left goal back net
    mesh = group.getObjectByName('goalNetBack');
    if (!mesh) {
      // Create back goal net
      geometry = this.fetchGeometry('planeGeo');
      material = this.fetchMaterial('goalNetBackMat');
      addMesh('goalNetBack', false);
    }
    mesh.position.set(field.lineWidth + netDepth / 2, dimensions.z / 2, 0);
    mesh.scale.set(netWidth, netHeight, 1);
    mesh.rotation.order = 'ZYX';
    mesh.rotation.y = -Math.PI / 2;
    mesh.rotation.x = (Math.PI / 2) - Math.atan(dimensions.z / netDepth);
    mesh.material.map.repeat.set(netWidth, netHeight);
    mesh.material.needsUpdate = true;
  }

  /**
   * Create a ball representation.
   *
   * @param  {!Ball} ball the ball instance
   * @return {void}
   */
  createBall (ball)
  {
    // Create simple ball placeholder
    const placeholder = SceneUtil.createSimpleBall(ball.radius);
    ball.objGroup.add(placeholder);

    // Load nice looking ball object
    SceneUtil.loadObject('soccer_ball.json',
      /**
       * @param  {!THREE.Scene} scene the loaded scene
       * @return {void}
       */
      function(scene) { // onLoad
        const geometry = new THREE.BufferGeometry();
        geometry.fromGeometry(/**@type {!THREE.Geometry}*/(/**@type {!THREE.Mesh}*/(scene.getObjectByName('soccerball')).geometry));
        geometry.name = 'ballGeo';

        const material = SceneUtil.createStdPhongMat('ballMat', 0xffffff, 'rcs-soccerball.png');

        const mesh = new THREE.Mesh(geometry, material);
        mesh.name = 'ballSphere';
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        // Exchange placeholder with nice looking ball mesh
        ball.objGroup.remove(placeholder);
        ball.objGroup.add(mesh);
      });
  }

  /**
   * Fetch the material with the given name from the internal cache (or create it if not existent).
   *
   * @param  {string} name the unique name of the material
   * @return {(!THREE.Material | !Array<!THREE.Material>)} the requested (multi-)material
   *                             or a default material if the requested material definition was not found
   */
  fetchMaterial (name)
  {
    let material = this.materialCache[name];
    let texture;

    if (material === undefined) {
      switch (name) {
        case 'skyBoxMat':
          material = SceneUtil.createSkyBoxMaterial();
          break;
        case 'grassMat':
          texture = SceneUtil.loadTexture('field.png');
          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.RepeatWrapping;
          material = new THREE.MeshPhongMaterial({name: 'fieldMat', color: 0xcccccc, map: texture});
          break;
        case 'tbBorderMat':
          texture = SceneUtil.loadTexture('field_border.png');
          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.RepeatWrapping;
          material = new THREE.MeshPhongMaterial({name: 'tbBorderMat', color: 0xaa99aa, map: texture});
          break;
        case 'lrBorderMat':
          texture = SceneUtil.loadTexture('field_border.png');
          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.RepeatWrapping;
          material = new THREE.MeshPhongMaterial({name: 'lrBorderMat', color: 0xaa99aa, map: texture});
          SceneUtil.offsetMaterial(material, -0.5, -0.05);
          break;
        case 'lineMat':
          material = new THREE.MeshBasicMaterial({name: 'lineMat', color: 0xeeeeee, side: THREE.DoubleSide});
          SceneUtil.offsetMaterial(material, -1, -1);
          break;
        case 'goalNetSidesMat':
          texture = SceneUtil.loadTexture('goalnet.png');
          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.RepeatWrapping;
          material = SceneUtil.createStdPhongMat('goalNetSidesMat', 0xffffff, texture);
          material.side = THREE.DoubleSide;
          material.transparent = true;
          break;
        case 'goalNetBackMat':
          texture = SceneUtil.loadTexture('goalnet.png');
          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.RepeatWrapping;
          material = SceneUtil.createStdPhongMat('goalNetBackMat', 0xffffff, texture);
          material.side = THREE.DoubleSide;
          material.transparent = true;
          break;
        case 'leftGoalMat':
          material = SceneUtil.createStdPhongMat(name, 0xcccc00);
          material.side = THREE.DoubleSide;
          SceneUtil.offsetMaterial(material, -1, -0.1);
          break;
        case 'rightGoalMat':
          material = SceneUtil.createStdPhongMat(name, 0x0088bb);
          material.side = THREE.DoubleSide;
          SceneUtil.offsetMaterial(material, -1, -0.1);
          break;
        default:
          // By default create a quite white material
          material = SceneUtil.createStdPhongMat(name, 0xeeeeee);
          break;
      }

      this.materialCache[name] = material;
    }

    return material;
  }

  /**
   * Fetch the geometry with the given name from the internal cache (or create it if not existent).
   *
   * @param  {string} name the unique name of the geometry
   * @return {!THREE.Geometry} the requested geometry
   */
  fetchGeometry (name)
  {
    let geometry = this.geometryCache[name];

    if (geometry === undefined) {
      switch (name) {
      case 'skyBoxGeo':
        geometry = new THREE.BoxBufferGeometry(1024, 1024, 1024);
        break;
      case 'planeGeo':
        geometry = new THREE.PlaneBufferGeometry(1, 1);
        break;
      case 'goalNetSidesGeo':
        geometry = SceneUtil.createHockeyGoalSideNetGeometry()
        break;
      default:
        // Log error
        console.log('Geometry "' + name + '" not found!');
        geometry = new THREE.BoxBufferGeometry(0.5, 0.5, 0.5);
        break;
      }

      this.geometryCache[name] = geometry;
    }

    return geometry;
  }
}

export { WorldModelFactory };
