/**
 * Simple Three.js scene helpers.
 * 
 * @author Stefan Glaser
 */
class SceneUtil
{
  /**
   * Create a geometry representing the field lines.
   *
   * @param  {number} lineWidth the field line width
   * @param  {!THREE.Vector2} fieldDimensions the dimensions of the field
   * @param  {number} centerRadius the radius of the center circle
   * @param  {!THREE.Vector2} goalAreaDimensions the dimensions of the goal area
   * @param  {?THREE.Vector3} penaltyAreaDimensions the dimensions of the penalty area + penalty kick spot
   * @return {!THREE.BufferGeometry}
   */
  static createFieldLinesGeometry (lineWidth,
                                   fieldDimensions,
                                   centerRadius,
                                   goalAreaDimensions,
                                   penaltyAreaDimensions)
  {
    const halfLength = fieldDimensions.x / 2;
    const halfWidth = fieldDimensions.y / 2;
    const halfLineWidth = lineWidth / 2;
    const halfGoalAreaWidth = goalAreaDimensions.y / 2;
    let tempX = 0;
    const mat = new THREE.Matrix4();

    /**
     * Helper function for simple merging of geometries.
     *
     * @param {number} x the x position value
     * @param {number} y the y position value
     * @param {number=} rotZ the z rotation (if not zero)
     */
     const mergeAt = function (x, y, rotZ) {
      // Set matrix rotation
      if (rotZ) {
        mat.makeRotationZ(rotZ);
      } else {
        mat.identity();
      }

      // Set matrix position
      mat.elements[12] = x;
      mat.elements[13] = y;

      // Merge geometry
      totalGeometry.merge(tempGeometry, mat);
    };


    // ---------- Center circle geometry
    let radius = centerRadius;
    const totalGeometry = new THREE.RingGeometry(radius - halfLineWidth, radius + halfLineWidth, 64, 1);


    // ---------- Vertical field line geometry
    let tempGeometry = new THREE.PlaneGeometry(lineWidth, fieldDimensions.y);

    // Left/Right border line
    mergeAt(-halfLength, 0);
    mergeAt(halfLength, 0);

    // Center line
    mergeAt(0, 0);


    // ---------- Horizontal field line geometry
    tempGeometry = new THREE.PlaneGeometry(fieldDimensions.x + lineWidth, lineWidth);

    // Top/Bottom border line
    mergeAt(0, -halfWidth);
    mergeAt(0, halfWidth);


    // ---------- Corner circle geometry
    radius = fieldDimensions.x / 105.0;
    tempGeometry = new THREE.RingGeometry(radius - halfLineWidth, radius + halfLineWidth, 8, 1, 0, Math.PI / 2);

    // Top left corner circle
    mergeAt(-halfLength, -halfWidth);

    // Top right corner circle
    mergeAt(halfLength, -halfWidth, Math.PI / 2);

    // Bottom right corner circle
    mergeAt(halfLength, halfWidth, Math.PI);

    // Bottom left corner circle
    mergeAt(-halfLength, halfWidth, -Math.PI / 2);


    // ---------- Center spot geometry
    tempGeometry = new THREE.CircleGeometry(lineWidth * 1.2, 16);
    mergeAt(0, 0);


    // Penalty area
    if (penaltyAreaDimensions !== null) {
      const halfPenaltyWidth = penaltyAreaDimensions.y / 2;
      tempX = halfLength - penaltyAreaDimensions.z;

      // Left/Right penalty kick spot
      mergeAt(-tempX, 0);
      mergeAt(tempX, 0);


      // ---------- Vertical penalty area line geometry
      tempGeometry = new THREE.PlaneGeometry(lineWidth, penaltyAreaDimensions.y + lineWidth);
      tempX = halfLength - penaltyAreaDimensions.x;

      // Left/Right penalty area front line
      mergeAt(-tempX, 0);
      mergeAt(tempX, 0);


      // ---------- Horizontal penalty area line geometry
      tempGeometry = new THREE.PlaneGeometry(penaltyAreaDimensions.x, lineWidth);
      tempX = halfLength - penaltyAreaDimensions.x / 2;

      // Left/Right penalty area top line
      mergeAt(-tempX, -halfPenaltyWidth);
      mergeAt(tempX, -halfPenaltyWidth);

      // Left/Right penalty area bottom line
      mergeAt(-tempX, halfPenaltyWidth);
      mergeAt(tempX, halfPenaltyWidth);


      // ---------- Penalty area arcs geometry
      const diffAngle = Math.acos((penaltyAreaDimensions.x - penaltyAreaDimensions.z) / centerRadius);
      tempGeometry = new THREE.RingGeometry(centerRadius - halfLineWidth, centerRadius + halfLineWidth, 32, 1, diffAngle, -2 * diffAngle);
      tempX = halfLength - penaltyAreaDimensions.z;

      // Left/Right penalty area arc
      mergeAt(-tempX, 0);
      mergeAt(tempX, 0, Math.PI);
    }


    // ---------- Vertical goal area lines geometry
    tempGeometry = new THREE.PlaneGeometry(lineWidth, goalAreaDimensions.y + lineWidth);
    tempX = halfLength - goalAreaDimensions.x;

    // Left/Right goal area front line
    mergeAt(-tempX, 0);
    mergeAt(tempX, 0);


    // ---------- Horizontal goal area lines geometry
    tempGeometry = new THREE.PlaneGeometry(goalAreaDimensions.x, lineWidth);
    tempX = halfLength - goalAreaDimensions.x / 2;

    // Left/Right goal area top line
    mergeAt(-tempX, -halfGoalAreaWidth);
    mergeAt(tempX, -halfGoalAreaWidth);

    // Left/Right goal area bottom line
    mergeAt(-tempX, halfGoalAreaWidth);
    mergeAt(tempX, halfGoalAreaWidth);


    // Create final buffer geometry from total geometry
    const geometry = new THREE.BufferGeometry();
    geometry.name = 'fieldLinesGeo';
    geometry.fromGeometry(totalGeometry);

    return geometry;
  }

  /**
   * Create a geometry representing a hockey goal.
   *
   * @param  {number} postRadius the goal post radius
   * @param  {!THREE.Vector3} dimensions the dimensions of the goal
   * @return {!THREE.BufferGeometry}
   */
  static createHockeyGoalGeometry (postRadius, dimensions)
  {
    const mat = new THREE.Matrix4();

    /**
     * Helper function for simple merging of geometries.
     *
     * @param {number} x the x position value
     * @param {number} y the y position value
     * @param {number} z the z position value
     * @param {number=} rot the x/y rotation (if not zero)
     * @param {boolean=} yRot indicator if rot is about y
     */
     const mergeAt = function (x, y, z, rot, yRot) {
      // Set matrix rotation
      if (rot) {
        if (yRot) {
          mat.makeRotationY(rot);
        } else {
          mat.makeRotationX(rot);
        }
      } else {
        mat.identity();
      }

      // Set matrix position
      mat.elements[12] = x;
      mat.elements[13] = y;
      mat.elements[14] = z;

      // Merge geometry
      totalGeometry.merge(tempGeometry, mat);
    };


    const goalBarRadius = postRadius / 2;
    const halfGoalWidth = postRadius + dimensions.y / 2;
    const halfGoalHeight = (goalBarRadius + dimensions.z) / 2;

    const totalGeometry = new THREE.Geometry();


    // ---------- Goal post geometry
    let tempGeometry = new THREE.CylinderGeometry(postRadius, postRadius, dimensions.z + goalBarRadius, 16);

    // Left/Right goal posts
    mergeAt(postRadius, halfGoalWidth, halfGoalHeight, -Math.PI / 2);
    mergeAt(postRadius, -halfGoalWidth, halfGoalHeight, -Math.PI / 2);


    // ---------- Upper goal bar geometry
    tempGeometry = new THREE.CylinderGeometry(goalBarRadius, goalBarRadius, halfGoalWidth * 2, 8);

    // Upper goal bar
    mergeAt(postRadius, 0, dimensions.z);


    // ---------- Bottom goal bar cylinder geometry
    const angle = Math.atan(0.5 * dimensions.z / dimensions.x);
    tempGeometry = new THREE.CylinderGeometry(goalBarRadius, goalBarRadius, halfGoalWidth * 2, 8, 1, false, -0.5 * Math.PI, angle);

    // Bottom goal bar cylinder
    mergeAt(dimensions.x, 0, 0);


    // ---------- Bottom goal bar plane geometry
    tempGeometry = new THREE.PlaneGeometry(goalBarRadius, halfGoalWidth * 2);

    // Bottom goal bar bottom plane
    mergeAt(dimensions.x - goalBarRadius / 2, 0, 0);

    // Bottom goal bar upper plane
    mergeAt(dimensions.x - Math.cos(angle) * goalBarRadius / 2, 0, Math.sin(angle) * goalBarRadius / 2, angle, true);


    // ---------- Goal stand geometry
    const triShape = new THREE.Shape();
    triShape.moveTo(0, 0);
    triShape.lineTo(dimensions.x, 0);
    triShape.lineTo(0, dimensions.z / 2);
    triShape.lineTo(0, 0);
    tempGeometry = new THREE.ShapeGeometry(triShape);

    // Left/Right goal stands
    mergeAt(0, halfGoalWidth, 0, Math.PI / 2);
    mergeAt(0, -halfGoalWidth, 0, Math.PI / 2);


    // Create final buffer geometry from total geometry
    const geometry = new THREE.BufferGeometry();
    geometry.name = 'goalGeo';
    geometry.fromGeometry(totalGeometry);

    return geometry;
  }

  /**
   * Create a geometry representing the side nets of a hockey goal.
   *
   * @return {!THREE.BufferGeometry}
   */
  static createHockeyGoalSideNetGeometry () {
    const totalGeometry = new THREE.Geometry();

    const triShape = new THREE.Shape();
    triShape.moveTo(0, 0);
    triShape.lineTo(1, 0);
    triShape.lineTo(0, 1);
    triShape.lineTo(0, 0);
    const tempGeometry = new THREE.ShapeGeometry(triShape);

    const mat = new THREE.Matrix4();
    mat.makeRotationX(Math.PI / 2);
    mat.elements[13] = 0.5;
    totalGeometry.merge(tempGeometry, mat);
    mat.elements[13] = -0.5;
    totalGeometry.merge(tempGeometry, mat);


    // Create final buffer geometry from total geometry
    const geometry = new THREE.BufferGeometry();
    geometry.name = 'goalNetSidesGeo';
    geometry.fromGeometry(totalGeometry);

    return geometry;
  }



  /**
   * Create a new texture from the given path.
   *
   * @param  {string} path the texture path
   * @return {!THREE.Texture} a new texture object
   */
  static loadTexture (path)
  {
    if (TextureLoader === null) {
      TextureLoader = new THREE.TextureLoader();
    }

    return TextureLoader.load(TexturePath + path);
  }

  /**
   * Load an object from the given path.
   *
   * @param  {string} path the object file path
   * @param  {!Function} onLoad the on load callback
   * @param  {!Function=} onProgress the on progress callback
   * @param  {!Function=} onError the on error callback
   * @return {void}
   */
  static loadObject (path, onLoad, onProgress, onError)
  {
    if (ObjectLoader === null) {
      ObjectLoader = new THREE.ObjectLoader();
    }

    ObjectLoader.load(ModelPath + path,
      onLoad,
      onProgress,
      function(xhr) {
        console.error('Error loading object "' + path + '": ' + xhr.statusText);

        if (onError !== undefined) {
          onError(xhr);
        }
      });
  }

  /**
   * Create a MeshPhongMaterial.
   * The texture argument can be a texture path or an actual texture object.
   * In case of a texture path, a new texture is loaded from the given path.
   * This material has by default:
   *   specular: 0x7f7f7f
   *   emissive: 0x000000
   *   shininess: 49
   *
   * @param {string} name the name of the material
   * @param {number} color the material color
   * @param {(!THREE.Texture | string)=} texture the material texture
   * @return {!THREE.MeshPhongMaterial} the new material
   */
  static createStdPhongMat (name, color, texture)
  {
    let myTexture = null;

    if (texture !== undefined) {
      if (typeof texture === 'string') {
        // Load texture file
        myTexture = SceneUtil.loadTexture(texture);
      } else {
        // Directly use given texture
        myTexture = texture;
      }
    }


    return new THREE.MeshPhongMaterial({
          name: name,
          color: color,
          specular: 0x7f7f7f,
          emissive: 0x000000,
          shininess: 49,
          map: myTexture
        });
  }

  /**
   * Create a new number material.
   *
   * @param  {string} name the name of the material
   * @param  {number} matColor the material color
   * @param  {number} number the number to print on the texture
   * @param  {number=} numColor the color of the number texture
   * @return {!THREE.Material} the number material
   */
  static createStdNumberMat (name, matColor, number, numColor)
  {
    if (numColor === undefined) {
      numColor = 0x000000;
    }

    // Create number texture
    return SceneUtil.createStdPhongMat(name, matColor);

    // const text = '' + number;
    // const canvas1 = document.createElement('canvas');

    // const context1 = canvas1.getContext('2d');
    // context1.clearRect(0, 0, 64, 64);

    // canvas1.width = 64;
    // canvas1.height = 64;

    // context1.fillStyle = 'white';
    // context1.fillRect(0, 0, 64, 64);

    // context1.font = '44px Arial Black';
    // context1.fillStyle = 'black';
    // let textWidth = context1.measureText(text).width;

    // if (number < 10) {
    //   context1.fillText(text, 32 - textWidth / 2, 52);
    // } else {
    //   const firstChar = text.slice(0, 1);
    //   const secondChar = text.slice(1, 2);
    //   const firstWidth = textWidth - context1.measureText(secondChar).width - 2;
    //   const secondWidth = textWidth - context1.measureText(firstChar).width - 2;
    //   textWidth = firstWidth + secondWidth;

    //   context1.fillText(firstChar, 30 - (textWidth / 2), 48);
    //   context1.fillText(secondChar, 30 - (textWidth / 2) + firstWidth, 48);
    // }



    // // const context1 = canvas1.getContext('2d');
    // // context1.clearRect(0, 0, 32, 32);

    // // canvas1.width = 32;
    // // canvas1.height = 32;

    // // context1.fillStyle = 'white';
    // // context1.fillRect(0, 0, 32, 32);

    // // context1.font = '900 22px Arial';
    // // context1.fillStyle = 'black';
    // // const halfTextWidth = context1.measureText(text).width / 2;
    // // context1.fillText(text, 16 - halfTextWidth, 28);


    // const texture1 = new THREE.Texture(canvas1);
    // texture1.needsUpdate = true;

    // const mat = SceneUtil.createStdPhongMat(name, matColor, texture1);
    // // mat.transparent = true;

    // return mat;
  }

  /**
   * Offset the given material to avoid z-fighting.
   *
   * @param  {!THREE.Material} material the material to offset
   * @param  {number=} factor the offset factor
   * @param  {number=} units the offset units
   * @return {void}
   */
  static offsetMaterial (material, factor, units)
  {
    material.depthTest = true;
    material.polygonOffset = true;
    material.polygonOffsetFactor = factor || -1;
    material.polygonOffsetUnits = units || -0.1;
  }

  /**
   * Create a mesh with the given parameter.
   * By default, the mesh will cast and receive shadows.
   *
   * @param  {string} name the name of the mesh
   * @param  {(!THREE.Geometry | !THREE.BufferGeometry)} geometry the mesh geometry
   * @param  {(!THREE.Material | !Array<!THREE.Material>)} material the mesh material
   * @param  {boolean=} rotXNeg90 true if the mesh should be rotated around x about -90 degrees, false for no rotation
   * @return {!THREE.Mesh} a new mesh with the specified properties
   */
  static createMesh (name, geometry, material, rotXNeg90)
  {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = name;
    mesh.receiveShadow = true;
    mesh.castShadow = true;

    if (rotXNeg90) {
      mesh.rotation.x = -Math.PI / 2;
    }

    return mesh;
  }

  /**
   * Create a mesh with the given parameter.
   *
   * @param  {string} name the name of the mesh
   * @param  {(!THREE.Geometry | !THREE.BufferGeometry)} geometry the mesh geometry
   * @param  {(!THREE.Material | !Array<!THREE.Material>)} material the mesh material
   * @param  {number} x the x-coordinate of the mesh
   * @param  {number} y the y-coordinate of the mesh
   * @param  {number} z the z-coordinate of the mesh
   * @param  {boolean=} rotXNeg90 true if the mesh should be rotated around x about -90 degrees, false for no rotation
   * @return {!THREE.Mesh} a new mesh with the specified properties
   */
  static createMeshAt (name, geometry, material, x, y, z, rotXNeg90)
  {
    const mesh = SceneUtil.createMesh(name, geometry, material, rotXNeg90);

    mesh.position.set(x, y, z);

    return mesh;
  }

  /**
   * Create a simple circle for representing a selected object.
   *
   * @param {number} radius the circle radius
   * @param {number} halfLineWidth the half circle line width
   * @return {!THREE.Mesh} the selection mesh
   */
  static createSelectionMesh (radius, halfLineWidth)
  {
    const mesh = new THREE.Mesh(new THREE.RingBufferGeometry(radius - halfLineWidth, radius + halfLineWidth, 16, 1), SelectionMaterial);
    mesh.name = 'selectionCircle';
    mesh.visible = false;
    mesh.receiveShadow = false;
    mesh.castShadow = false;
    mesh.rotation.x = -Math.PI / 2;

    return mesh;
  }

  /**
   * Create a dummy mesh used as placehoder for loading/failing body parts.
   * @return {!THREE.Mesh} a dummy mesh
   */
  static createDummyMesh ()
  {
    const mesh = new THREE.Mesh(DummyGeometry, DummyMaterial);
    mesh.name = 'placeholder';
    mesh.receiveShadow = false;
    mesh.castShadow = false;

    return mesh;
  }

  /**
   * Create a sky box material.
   *
   * @return {!Array<!THREE.Material>} the sky box material
   */
  static createSkyBoxMaterial ()
  {
    const texPosx = SceneUtil.loadTexture('sky_posx.jpg');
    const texNegx = SceneUtil.loadTexture('sky_negy.jpg');
    const texPosy = SceneUtil.loadTexture('sky_posy.jpg');
    const texNegy = SceneUtil.loadTexture('sky_negz.jpg');
    const texPosz = SceneUtil.loadTexture('sky_posz.jpg');
    const texNegz = SceneUtil.loadTexture('sky_negx.jpg');

    return [
            new THREE.MeshBasicMaterial({ map: texPosx, side: THREE.BackSide }),
            new THREE.MeshBasicMaterial({ map: texNegx, side: THREE.BackSide }),
            new THREE.MeshBasicMaterial({ map: texPosy, side: THREE.BackSide }),
            new THREE.MeshBasicMaterial({ map: texNegy, side: THREE.BackSide }),
            new THREE.MeshBasicMaterial({ map: texPosz, side: THREE.BackSide }),
            new THREE.MeshBasicMaterial({ map: texNegz, side: THREE.BackSide }),
       ];
  }

  /**
   * Create a sky box of the given size.
   *
   * @param  {number} size the size of the box
   * @return {!THREE.Mesh} the sky box mesh
   */
  static createSkyBox (size)
  {
    const boxMaterial = SceneUtil.createSkyBoxMaterial();
    const boxGeometry = new THREE.BoxBufferGeometry(size, size, size);

    const mesh = new THREE.Mesh(boxGeometry, boxMaterial);
    mesh.name = 'skyBox';

    return mesh;
  }

  /**
   * Create a simple, white, spherical ball mesh.
   *
   * @param  {number} radius the ball radius
   * @return {!THREE.Mesh} the ball mesh
   */
  static createSimpleBall (radius)
  {
    const geometry = new THREE.SphereBufferGeometry(radius, 16, 16);
    geometry.name = 'ballGeo';

    const material = SceneUtil.createStdPhongMat('ballMat', 0xffffff);

    return SceneUtil.createMesh('ballSphere', geometry, material);
  }

  /**
   * Add a soccer field (grass) plane to the given object group.
   *
   * @param  {!THREE.Object3D} group the object group to add the field plane
   * @param  {number} fieldLength the length of the field
   * @param  {number} fieldWidth the width of the field
   * @param  {?number} textureRepeat the number of texture repeats
   * @return {void}
   */
  static addFieldPlane (group, fieldLength, fieldWidth, textureRepeat)
  {
    let mesh;

    /**
     * Helper method for adding meshes.
     * @param {string} name
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @return {void}
     */
    const addMesh = function(name, x, y, z) {
      mesh = new THREE.Mesh(geometry, material);
      mesh.name = name;
      mesh.position.set(x, y, z);
      mesh.rotation.x = -Math.PI / 2;
      mesh.receiveShadow = true;
      mesh.castShadow = false;

      group.add(mesh);
    };


    // Create field plane
    let halfLength = Math.floor((fieldLength + 1.99) / 2);
    let geometry = new THREE.PlaneBufferGeometry(halfLength * 2, fieldWidth);
    let texture = SceneUtil.loadTexture('field.png');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    if (textureRepeat !== null) {
      texture.repeat.set(textureRepeat, fieldWidth * textureRepeat / fieldLength);
    } else {
      texture.repeat.set(halfLength, fieldWidth);
    }
    let material = new THREE.MeshPhongMaterial({name: 'fieldMat', color: 0xcccccc, map: texture});
    addMesh('fieldPlane', 0, 0, 0);

    // Create field border
    halfLength = fieldLength / 2;
    const halfWidth = fieldWidth / 2;
    const borderSize = fieldLength / 12;
    geometry = new THREE.PlaneBufferGeometry(fieldLength + borderSize * 2, borderSize);
    texture = SceneUtil.loadTexture('field_border.png');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set((fieldLength + borderSize * 2), borderSize);
    material = new THREE.MeshPhongMaterial({name: 'tbBorderMat', color: 0xaa99aa, map: texture});
    addMesh('topBorder', 0, 0, -halfWidth - borderSize / 2);
    addMesh('bottomBorder', 0, 0, halfWidth + borderSize / 2);

    texture = SceneUtil.loadTexture('field_border.png');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(borderSize, fieldWidth);
    material = new THREE.MeshPhongMaterial({name: 'lrBorderMat', color: 0xaa99aa, map: texture});
    SceneUtil.offsetMaterial(material, -0.5, -0.05);
    geometry = new THREE.PlaneBufferGeometry(borderSize, fieldWidth);
    addMesh('leftBorder', -halfLength - borderSize / 2, 0, 0);
    addMesh('rightBorder', halfLength + borderSize / 2, 0, 0);
  }

  /**
   * Add standard field lines to the given object group.
   *
   * @param  {!THREE.Object3D} group the object group to add the field plane
   * @param  {number} lineWidth the field line width
   * @param  {!THREE.Vector2} fieldDimensions the dimensions of the field
   * @param  {number} centerRadius the radius of the center circle
   * @param  {!THREE.Vector2} goalAreaDimensions the dimensions of the goal area
   * @param  {?THREE.Vector3} penaltyAreaDimensions the dimensions of the penalty area + penalty kick spot
   * @return {void}
   */
  static addFieldLines (group,
                        lineWidth,
                        fieldDimensions,
                        centerRadius,
                        goalAreaDimensions,
                        penaltyAreaDimensions)
  {
    let mesh;
    let tempX = 0;
    const lineMaterial = new THREE.MeshBasicMaterial({ color: 0xeeeeee, side: THREE.DoubleSide });
    SceneUtil.offsetMaterial(lineMaterial, -1, -0.1);

    /**
     * Helper method for adding meshes.
     * @param {string} name
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @param {number=} rotZ
     * @return {void}
     */
     const addMesh = function(name, x, y, z, rotZ) {
      mesh = new THREE.Mesh(geometry, lineMaterial);
      mesh.name = name;
      mesh.position.set(x, y, z);
      mesh.rotation.x = -Math.PI / 2;
      mesh.rotation.z = rotZ ? rotZ : 0;
      mesh.receiveShadow = true;
      mesh.castShadow = false;

      group.add(mesh);
    };

    const halfLength = fieldDimensions.x / 2;
    const halfWidth = fieldDimensions.y / 2;
    const halfLineWidth = lineWidth / 2;

    // Circle
    let radius = centerRadius;
    let geometry = new THREE.RingBufferGeometry(radius - halfLineWidth, radius + halfLineWidth, 64, 1);
    addMesh('centerCircle', 0, 0, 0);

    // General field lines (l, r, t, b, c)
    geometry = new THREE.PlaneBufferGeometry(fieldDimensions.x + lineWidth, lineWidth);
    addMesh('topBorderLine', 0, 0, -halfWidth);
    addMesh('btmBorderLine', 0, 0, halfWidth);

    geometry = new THREE.PlaneBufferGeometry(lineWidth, fieldDimensions.y);
    addMesh('leftBorderLine', -halfLength, 0, 0);
    addMesh('rightBorderLine', halfLength, 0, 0);

    addMesh('centerLine', 0, 0, 0);

    // Corner circles
    radius = fieldDimensions.x / 105.0;
    geometry = new THREE.RingBufferGeometry(radius - halfLineWidth, radius + halfLineWidth, 8, 1, 0, Math.PI / 2);
    addMesh('btmLeftCircle', -halfLength, 0, halfWidth);
    addMesh('btmRightCircle', halfLength, 0, halfWidth, Math.PI / 2);
    addMesh('topRightCircle', halfLength, 0, -halfWidth, Math.PI);
    addMesh('topLeftCircle', -halfLength, 0, -halfWidth, -Math.PI / 2);

    // Center spot
    geometry = new THREE.CircleBufferGeometry(lineWidth * 1.2, 16);
    addMesh('centerSpot', 0, 0, 0);

    // Penalty area
    if (penaltyAreaDimensions !== null) {
      // Penalty kick spots
      tempX = halfLength - penaltyAreaDimensions.z;
      addMesh('leftPenaltySpot', -tempX, 0, 0);
      addMesh('rightPenaltySpot', tempX, 0, 0);

      // Penalty area front lines
      const halfPenaltyWidth = penaltyAreaDimensions.y / 2;
      tempX = halfLength - penaltyAreaDimensions.x;
      geometry = new THREE.PlaneBufferGeometry(lineWidth, penaltyAreaDimensions.y + lineWidth);
      addMesh('leftPAFrontLine', -tempX, 0, 0);
      addMesh('rightPAFrontLine', tempX, 0, 0);

      // Penalty area top and bottom lines
      tempX = halfLength - penaltyAreaDimensions.x / 2;
      geometry = new THREE.PlaneBufferGeometry(penaltyAreaDimensions.x, lineWidth);
      addMesh('leftPATopLine', -tempX, 0, -halfPenaltyWidth);
      addMesh('leftPABtmLine', -tempX, 0, halfPenaltyWidth);

      addMesh('rightPABtmLine', tempX, 0, -halfPenaltyWidth);
      addMesh('rightPATopLine', tempX, 0, halfPenaltyWidth);

      // Penalty area arcs
      tempX = halfLength - penaltyAreaDimensions.z;
      const diffAngle = Math.acos((penaltyAreaDimensions.x - penaltyAreaDimensions.z) / centerRadius);
      geometry = new THREE.RingBufferGeometry(centerRadius - halfLineWidth, centerRadius + halfLineWidth, 32, 1, diffAngle, -2 * diffAngle);
      addMesh('leftPAArc', -tempX, 0, 0);
      addMesh('rightPAArc', tempX, 0, 0, Math.PI);
    }

    // Goal area
    const halfGoalAreaWidth = goalAreaDimensions.y / 2;
    tempX = halfLength - goalAreaDimensions.x;
    geometry = new THREE.PlaneBufferGeometry(lineWidth, goalAreaDimensions.y + lineWidth);
    addMesh('leftGAFrontLine', -tempX, 0, 0);
    addMesh('rightGAFrontLine', tempX, 0, 0);

    tempX = halfLength - goalAreaDimensions.x / 2;
    geometry = new THREE.PlaneBufferGeometry(goalAreaDimensions.x, lineWidth);
    addMesh('leftGATopLine', -tempX, 0, -halfGoalAreaWidth);
    addMesh('leftGABtmLine', -tempX, 0, halfGoalAreaWidth);

    addMesh('rightGATopLine', tempX, 0, -halfGoalAreaWidth);
    addMesh('rightGABtmLine', tempX, 0, halfGoalAreaWidth);
  }

  /**
   * Create a hockey (triangular) goal. The created goal is for the right side.
   *
   * @param  {string} name the name of the goal object group
   * @param  {number} postRadius the line width
   * @param  {!THREE.Vector3} dimensions the goal dimensions
   * @param  {number} color the goal color
   * @return {!THREE.Object3D} the ball object
   */
  static createHockeyGoal (name, postRadius, dimensions, color)
  {
    let mesh;
    let shadows = true;
    const objGroup = new THREE.Object3D();
    objGroup.name = name;

    /**
     * Helper method for adding meshes.
     * @param {string} name
     * @param {!THREE.Material} material
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @param {boolean=} keepRot
     * @return {!THREE.Mesh}
     */
     const addMesh = function(name, material, x, y, z, keepRot) {
      mesh = new THREE.Mesh(geometry, material);
      mesh.name = name;
      mesh.position.set(x, y, z);
      mesh.rotation.x = keepRot ? 0 : -Math.PI / 2;
      mesh.receiveShadow = shadows;
      mesh.castShadow = shadows;
      objGroup.add(mesh);

      return mesh;
    };


    const goalBarRadius = postRadius / 2;
    const halfGoalWidth = postRadius + dimensions.y / 2;
    const halfGoalHeight = (goalBarRadius + dimensions.z) / 2;

    const goalMat = SceneUtil.createStdPhongMat('goalMat', color);
    goalMat.side = THREE.DoubleSide;

    const goalOffsetMat = goalMat.clone();
    SceneUtil.offsetMaterial(goalOffsetMat, -1, -0.1);


    // Goal posts
    let geometry = new THREE.CylinderBufferGeometry(postRadius, postRadius, dimensions.z + goalBarRadius, 16);
    addMesh('leftPost', goalOffsetMat, postRadius, halfGoalHeight, halfGoalWidth, true);
    addMesh('rightPost', goalOffsetMat, postRadius, halfGoalHeight, -halfGoalWidth, true);


    // Upper goal bar
    geometry = new THREE.CylinderBufferGeometry(goalBarRadius, goalBarRadius, halfGoalWidth * 2, 8);
    addMesh('upperBar', goalMat, postRadius, dimensions.z, 0);


    // Goal bottom bar
    const angle = Math.atan(0.5 * dimensions.z / dimensions.x);
    const tempGeometry = new THREE.CylinderGeometry(goalBarRadius, goalBarRadius, halfGoalWidth * 2, 8, 1, false, -0.5 * Math.PI, angle);
    const mat = new THREE.Matrix4();
    mat.identity();
    mat.elements[12] = -goalBarRadius / 2;
    tempGeometry.merge(new THREE.PlaneGeometry(goalBarRadius, halfGoalWidth * 2), mat);
    mat.makeRotationY(angle);
    mat.elements[12] = -Math.cos(angle) * goalBarRadius / 2;
    mat.elements[14] = Math.sin(angle) * goalBarRadius / 2;
    tempGeometry.merge(new THREE.PlaneGeometry(goalBarRadius, halfGoalWidth * 2), mat);

    geometry = new THREE.BufferGeometry();
    geometry.fromGeometry(tempGeometry);
    addMesh('bottomBar', goalOffsetMat, dimensions.x, 0, 0);


    // Goal stand
    let triShape = new THREE.Shape();
    triShape.moveTo(0, 0);
    triShape.lineTo(dimensions.x, 0);
    triShape.lineTo(0, dimensions.z / 2);
    triShape.lineTo(0, 0);
    geometry = new THREE.BufferGeometry();
    geometry.fromGeometry(new THREE.ShapeGeometry(triShape));
    addMesh('leftStand', goalMat, 0, 0, halfGoalWidth, true);
    addMesh('rightStand', goalMat, 0, 0, -halfGoalWidth, true);


    // Goal net
    shadows = false;
    const netWidth = dimensions.y + postRadius * 2 - 0.02;
    const netDepth = dimensions.x - postRadius - 0.01;
    const netHeight = Math.sqrt(netDepth * netDepth + dimensions.z * dimensions.z);

    const netSideTexture = SceneUtil.loadTexture('goalnet.png');
    netSideTexture.wrapS = THREE.RepeatWrapping;
    netSideTexture.wrapT = THREE.RepeatWrapping;
    netSideTexture.repeat.set(netDepth, dimensions.z);
    const goalNetMatSides = SceneUtil.createStdPhongMat('netSideMat', 0xffffff, netSideTexture);
    goalNetMatSides.side = THREE.DoubleSide;
    goalNetMatSides.transparent = true;

    const netBackTexture = SceneUtil.loadTexture('goalnet.png');
    netBackTexture.wrapS = THREE.RepeatWrapping;
    netBackTexture.wrapT = THREE.RepeatWrapping;
    netBackTexture.repeat.set(netWidth, netHeight);
    const goalNetMatBack = SceneUtil.createStdPhongMat('netBackMat', 0xffffff, netBackTexture);
    goalNetMatBack.side = THREE.DoubleSide;
    goalNetMatBack.transparent = true;

    triShape = new THREE.Shape();
    triShape.moveTo(0, 0);
    triShape.lineTo(netDepth, 0);
    triShape.lineTo(0, dimensions.z);
    triShape.lineTo(0, 0);
    geometry = new THREE.BufferGeometry();
    geometry.fromGeometry(new THREE.ShapeGeometry(triShape));
    addMesh('leftNet', goalNetMatSides, postRadius, 0, netWidth / 2, true);
    addMesh('rightNet', goalNetMatSides, postRadius, 0, -netWidth / 2, true);

    geometry = new THREE.PlaneBufferGeometry(netWidth, netHeight);
    addMesh('backNet', goalNetMatBack, postRadius + netDepth / 2, dimensions.z / 2, 0, true);
    mesh.rotation.order = 'ZYX';
    mesh.rotation.y = -Math.PI / 2;
    mesh.rotation.x = (Math.PI / 2) - Math.atan(dimensions.z / netDepth);

    return objGroup;
  }

  /**
   * Create a hockey (triangular) goal. The created goal is for the right side.
   *
   * @param  {!THREE.Object3D} scene the scene/group to add lighting
   * @param  {number} fieldLength the length of the field
   * @param  {number} fieldWidth the width of the field
   * @return {void}
   */
  static addStdLighting (scene, fieldLength, fieldWidth)
  {
    // Ambient lighting
    scene.add(new THREE.AmbientLight(0xeeeeee));


    // sun lighting
    const vertical = Math.ceil(fieldWidth * 0.8);
    const horizontal = Math.ceil(fieldLength * 0.7);
    const depth = fieldWidth;

    const directionalLight = new THREE.DirectionalLight(0xeeeeee, 0.4);
    directionalLight.position.set(300, 300, 500);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;

    directionalLight.shadow.camera.left = -horizontal;
    directionalLight.shadow.camera.right = horizontal;
    directionalLight.shadow.camera.top = vertical;
    directionalLight.shadow.camera.bottom = -vertical;
    directionalLight.shadow.camera.near = 655 - depth;
    directionalLight.shadow.camera.far = 655 + depth;

    scene.add(directionalLight);
  }
}

export { SceneUtil };


/**
 * The threejs texture loader.
 * @type {?THREE.TextureLoader}
 */
let TextureLoader = null;

/**
 * The texture path.
 * @const {string}
 */
const TexturePath = 'textures/';


/**
 * The threejs object loader.
 * @type {?THREE.ObjectLoader}
 */
let ObjectLoader = null;

/**
 * The object/model path.
 * @const {string}
 */
const ModelPath = 'models/';


/**
 * The selection material.
 * @type {!THREE.MeshPhongMaterial}
 */
export const SelectionMaterial = new THREE.MeshPhongMaterial({name: 'selectionMat', color: 0xeeeeee, side: THREE.DoubleSide});
SceneUtil.offsetMaterial(SelectionMaterial, -1.5, -0.15);

/**
 * The Dummy geometry.
 * @type {!THREE.BoxBufferGeometry}
 */
export const DummyGeometry = new THREE.BoxBufferGeometry(0.1, 0.1, 0.1);

/**
 * The dummy material.
 * @type {!THREE.MeshPhongMaterial}
 */
export const DummyMaterial = new THREE.MeshPhongMaterial({name: 'dummyMat', color: 0x000000});
