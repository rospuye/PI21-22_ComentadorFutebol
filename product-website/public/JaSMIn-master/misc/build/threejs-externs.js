/**
 * @fileoverview An externs file for the threejs library.
 * @externs
 */


/**
 * @const
 */
var THREE = {};



/******************************************************************************
 * Constants
 *****************************************************************************/
/**
 * @type {number}
 */
THREE.BackSide;

/**
 * @type {number}
 */
THREE.DoubleSide;

/**
 * @type {number}
 */
THREE.RepeatWrapping;

/**
 * @type {number}
 */
THREE.BasicShadowMap;

/**
 * @type {number}
 */
THREE.PCFShadowMap;

/**
 * @type {number}
 */
THREE.PCFSoftShadowMap;


/**
 * @type {Object}
 */
THREE.MOUSE = {};
/**
 * @type {number}
 */
THREE.MOUSE.LEFT;
/**
 * @type {number}
 */
THREE.MOUSE.MIDDLE;
/**
 * @type {number}
 */
THREE.MOUSE.RIGHT;




/******************************************************************************
 * THREE.Math
 *****************************************************************************/
/**
 * @type {Object}
 */
THREE.Math = {};

/**
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @return {number}
 */
THREE.Math.clamp = function(value, min, max) {};

/**
 * @return {string}
 */
THREE.Math.generateUUID = function() {};

/**
 * @param {number} value
 * @return {number}
 */
THREE.Math.nextPowerOfTwo = function(value) {};




/******************************************************************************
 * THREE.Vector3d
 *****************************************************************************/
/**
 * @constructor
 * @param {number=} x
 * @param {number=} y
 * @param {number=} z
 */
THREE.Vector3 = function(x, y, z) {};

/**
 * @type {number}
 */
THREE.Vector3.prototype.x;

/**
 * @type {number}
 */
THREE.Vector3.prototype.y;

/**
 * @type {number}
 */
THREE.Vector3.prototype.z;

/**
 * @param  {THREE.Vector3} other
 * @return {void}
 */
THREE.Vector3.prototype.copy = function(other) {};

/**
 * @return {void}
 * @param {number} x
 * @param {number} y
 * @param {number} z
 */
THREE.Vector3.prototype.set = function(x, y, z) {};

/**
 * @param  {number} scalar
 * @return {!THREE.Vector3}
 */
THREE.Vector3.prototype.setScalar = function(scalar) {};

/**
 * @param  {!THREE.Matrix4} matrix
 * @param  {number} col
 * @return {!THREE.Vector3}
 */
THREE.Vector3.prototype.setFromMatrixColumn = function(matrix, col) {};

/**
 * @param  {!THREE.Vector3} other
 * @return {!THREE.Vector3}
 */
THREE.Vector3.prototype.add = function(other) {};

/**
 * @param  {number} scalar
 * @return {!THREE.Vector3}
 */
THREE.Vector3.prototype.addScalar = function(scalar) {};

/**
 * @param  {!THREE.Vector3} other
 * @return {!THREE.Vector3}
 */
THREE.Vector3.prototype.sub = function(other) {};

/**
 * @param  {number} scalar
 * @return {!THREE.Vector3}
 */
THREE.Vector3.prototype.subScalar = function(scalar) {};

/**
 * @param  {number} scalar
 * @return {!THREE.Vector3}
 */
THREE.Vector3.prototype.multiplyScalar = function(scalar) {};

/**
 * @param  {number} scalar
 * @return {!THREE.Vector3}
 */
THREE.Vector3.prototype.divideScalar = function(scalar) {};

/**
 * @return {number}
 */
THREE.Vector3.prototype.length = function() {};

/**
 * @return {!THREE.Vector3}
 */
THREE.Vector3.prototype.normalize = function() {};

/**
 * @return {!THREE.Vector3}
 */
THREE.Vector3.prototype.negate = function() {};

/**
 * @param  {number} min
 * @param  {number} max
 * @return {number}
 */
THREE.Vector3.prototype.clampLength = function(min, max) {};

/**
 * @param  {THREE.Vector3} to
 * @param  {number} t
 * @return {!THREE.Vector3}
 */
THREE.Vector3.prototype.lerp = function(to, t) {};

/**
 * @param  {THREE.Vector3} from
 * @param  {THREE.Vector3} to
 * @param  {number} t
 * @return {void}
 */
THREE.Vector3.prototype.lerpVectors = function(from, to, t) {};

/**
 * @param  {!THREE.Matrix4} matrix
 * @return {!THREE.Vector3}
 */
THREE.Vector3.prototype.applyMatrix4 = function(matrix) {};

/**
 * @param  {!THREE.Vector3} other
 * @return {boolean}
 */
THREE.Vector3.prototype.equals = function(other) {};




/******************************************************************************
 * THREE.Vector2d
 *****************************************************************************/
/**
 * @constructor
 * @param {number=} x
 * @param {number=} y
 */
THREE.Vector2 = function(x, y) {};

/**
 * @type {number}
 */
THREE.Vector2.prototype.y;

/**
 * @param  {THREE.Vector2} other
 * @return {void}
 */
THREE.Vector2.prototype.copy = function(other) {};

/**
 * @return {void}
 * @param {number} x
 * @param {number} y
 */
THREE.Vector2.prototype.set = function(x, y) {};

/**
 * @param  {!THREE.Vector2} other
 * @return {boolean}
 */
THREE.Vector2.prototype.equals = function(other) {};




/******************************************************************************
 * THREE.Matrix4
 *****************************************************************************/
/**
 * @constructor
 */
THREE.Matrix4 = function() {};

/**
 * @type {!Float32Array}
 */
THREE.Matrix4.prototype.elements;

/**
 * @return {!THREE.Matrix4}
 */
THREE.Matrix4.prototype.identity = function() {};

/**
 * @param {!THREE.Matrix4} other
 * @return {!THREE.Matrix4}
 */
THREE.Matrix4.prototype.copy = function(other) {};

/**
 * @param {number} n11
 * @param {number} n12
 * @param {number} n13
 * @param {number} n14
 * @param {number} n21
 * @param {number} n22
 * @param {number} n23
 * @param {number} n24
 * @param {number} n31
 * @param {number} n32
 * @param {number} n33
 * @param {number} n34
 * @param {number} n41
 * @param {number} n42
 * @param {number} n43
 * @param {number} n44
 * @return {!THREE.Matrix4}
 */
THREE.Matrix4.prototype.set = function(n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44) {};

/**
 * @param {number} angle
 * @return {!THREE.Matrix4}
 */
THREE.Matrix4.prototype.makeRotationX = function(angle) {};

/**
 * @param {number} angle
 * @return {!THREE.Matrix4}
 */
THREE.Matrix4.prototype.makeRotationY = function(angle) {};

/**
 * @param {number} angle
 * @return {!THREE.Matrix4}
 */
THREE.Matrix4.prototype.makeRotationZ = function(angle) {};

/**
 * @param {!THREE.Euler} euler
 * @return {!THREE.Matrix4}
 */
THREE.Matrix4.prototype.makeRotationFromEuler = function(euler) {};








/******************************************************************************
 * THREE.Color
 *****************************************************************************/
/**
 * @constructor
 * @param {(number | string | !THREE.Color)} r
 * @param {number=} g
 * @param {number=} b
 */
THREE.Color = function(r, g, b) {};

/**
 * @type {number}
 */
THREE.Color.prototype.r;

/**
 * @type {number}
 */
THREE.Color.prototype.g;

/**
 * @type {number}
 */
THREE.Color.prototype.b;

/**
 * @param  {THREE.Color} other
 * @return {void}
 */
THREE.Color.prototype.copy = function(other) {};

/**
 * @param  {!THREE.Color} other
 * @return {boolean}
 */
THREE.Color.prototype.equals = function(other) {};

/**
 * @param  {number} value
 * @return {void}
 */
THREE.Color.prototype.setScalar = function(value) {};

/**
 * @return {number}
 */
THREE.Color.prototype.getHex = function() {};

/**
 * @param  {string} style
 * @return {!THREE.Color}
 */
THREE.Color.prototype.setStyle = function(style) {};

/**
 * @return {string}
 */
THREE.Color.prototype.getStyle = function() {};

/**
 * @return {string}
 */
THREE.Color.prototype.getHexString = function() {};






/******************************************************************************
 * THREE.Quaternion
 *****************************************************************************/
/**
 * @constructor
 * @param {number=} x
 * @param {number=} y
 * @param {number=} z
 * @param {number=} w
 */
THREE.Quaternion = function(x, y, z, w) {};

/**
 * @type {number}
 */
THREE.Quaternion.prototype.x;

/**
 * @type {number}
 */
THREE.Quaternion.prototype.y;

/**
 * @type {number}
 */
THREE.Quaternion.prototype.z;

/**
 * @type {number}
 */
THREE.Quaternion.prototype.w;

/**
 * @param  {THREE.Quaternion} other
 * @return {void}
 */
THREE.Quaternion.prototype.copy = function(other) {};

/**
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @param {number} w
 * @return {void}
 */
THREE.Quaternion.prototype.set = function(x, y, z, w) {};

/**
 * @param {THREE.Vector3} axis
 * @param {number} angle
 * @return {void}
 */
THREE.Quaternion.prototype.setFromAxisAngle = function(axis, angle) {};

/**
 * @param  {THREE.Quaternion} from
 * @param  {THREE.Quaternion} to
 * @param  {THREE.Quaternion} target
 * @param  {number} t
 * @return {void}
 */
THREE.Quaternion.slerp = function(from, to, target, t) {};






/******************************************************************************
 * THREE.Euler
 *****************************************************************************/
/**
 * @constructor
 * @param {number=} x
 * @param {number=} y
 * @param {number=} z
 * @param {string=} order
 */
THREE.Euler = function(x, y, z, order) {};

/**
 * @type {number}
 */
THREE.Euler.prototype.x;

/**
 * @type {number}
 */
THREE.Euler.prototype.y;

/**
 * @type {number}
 */
THREE.Euler.prototype.z;

/**
 * @type {string}
 */
THREE.Euler.prototype.order;

/**
 * @type {(!Function | undefined)}
 */
THREE.Euler.prototype.onChange;

/**
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @param {string=} order
 * @return {void}
 */
THREE.Euler.prototype.set = function(x, y, z, order) {};

/**
 * @param  {THREE.Euler} other
 * @return {void}
 */
THREE.Euler.prototype.copy = function(other) {};






/******************************************************************************
 * THREE.Object3D
 *****************************************************************************/
/**
 * @constructor
 */
THREE.Object3D = function() {};

/**
 * @type {string}
 */
THREE.Object3D.prototype.name;

/**
 * @type {string}
 */
THREE.Object3D.prototype.type;

/**
 * @type {!THREE.Vector3}
 */
THREE.Object3D.prototype.position;

/**
 * @type {!THREE.Euler}
 */
THREE.Object3D.prototype.rotation;

/**
 * @type {!THREE.Quaternion}
 */
THREE.Object3D.prototype.quaternion;

/**
 * @type {!THREE.Matrix4}
 */
THREE.Object3D.prototype.matrix;

/**
 * @type {!THREE.Vector3}
 */
THREE.Object3D.prototype.scale;

/**
 * @type {boolean}
 */
THREE.Object3D.prototype.visible;

/**
 * @type {boolean}
 */
THREE.Object3D.prototype.castShadow;

/**
 * @type {boolean}
 */
THREE.Object3D.prototype.receiveShadow;

/**
 * @type {!Array<THREE.Object3D>}
 */
THREE.Object3D.prototype.children;

/**
 * @type {boolean}
 */
THREE.Object3D.prototype.matrixAutoUpdate;

/**
 * @param {!THREE.Matrix4} matrix
 * @return {void}
 */
THREE.Object3D.prototype.applyMatrix = function(matrix) {};

/**
 * @param {THREE.Vector3} axis
 * @param {number} angle
 * @return {void}
 */
THREE.Object3D.prototype.setRotationFromAxisAngle = function(axis, angle) {};

/**
 * @param {(THREE.Object3D | THREE.Light)} child
 * @return {void}
 */
THREE.Object3D.prototype.add = function(child) {};

/**
 * @param {(THREE.Object3D | THREE.Light | undefined)} child
 * @return {void}
 */
THREE.Object3D.prototype.remove = function(child) {};

/**
 * @return {void}
 */
THREE.Object3D.prototype.updateMatrix = function() {};

/**
 * @param {!function(!THREE.Object3D)} callback
 * @return {void}
 */
THREE.Object3D.prototype.traverse = function(callback) {};

/**
 * @param {string} id
 * @return {!THREE.Object3D | undefined}
 */
THREE.Object3D.prototype.getObjectById = function(id) {};

/**
 * @param {string} name
 * @return {!THREE.Object3D | undefined}
 */
THREE.Object3D.prototype.getObjectByName = function(name) {};

/**
 * @param {string} name
 * @param {*} value
 * @return {!THREE.Object3D | undefined}
 */
THREE.Object3D.prototype.getObjectByProperty = function(name, value) {};

/**
 * @type {boolean}
 */
THREE.Object3D.DefaultMatrixAutoUpdate;






/******************************************************************************
 * THREE.Scene
 *****************************************************************************/
/**
 * @constructor
 * @extends {THREE.Object3D}
 */
THREE.Scene = function() {};





/******************************************************************************
 * THREE.Material
 *****************************************************************************/
/**
 * @constructor
 */
THREE.Material = function() {};

/**
 * @type {string}
 */
THREE.Material.prototype.name;

/**
 * @type {string}
 */
THREE.Material.prototype.type;

/**
 * @type {!THREE.Color}
 */
THREE.Material.prototype.color;

/**
 * @type {?THREE.Texture}
 */
THREE.Material.prototype.map;

/**
 * @type {number}
 */
THREE.Material.prototype.side;

/**
 * @type {boolean}
 */
THREE.Material.prototype.transparent;

/**
 * @type {boolean}
 */
THREE.Material.prototype.needsUpdate;

/**
 * @type {boolean}
 */
THREE.Material.prototype.depthTest;

/**
 * @type {boolean}
 */
THREE.Material.prototype.polygonOffset;

/**
 * @type {number}
 */
THREE.Material.prototype.polygonOffsetFactor;

/**
 * @type {number}
 */
THREE.Material.prototype.polygonOffsetUnits;

/**
 * @return {!THREE.Material}
 */
THREE.Material.prototype.clone = function() {};

/**
 * @return {void}
 */
THREE.Material.prototype.dispose = function() {};





/******************************************************************************
 * THREE.MeshPhongMaterial
 *****************************************************************************/
/**
 * @constructor
 * @extends {THREE.Material}
 * @param {!Object=} parameters
 */
THREE.MeshPhongMaterial = function(parameters) {};

/**
 * @type {!THREE.Color}
 */
THREE.MeshPhongMaterial.prototype.specular;

/**
 * @type {number}
 */
THREE.MeshPhongMaterial.prototype.shininess;

/**
 * @type {!THREE.Color}
 */
THREE.MeshPhongMaterial.prototype.emissive;





/******************************************************************************
 * THREE.MeshBasicMaterial
 *****************************************************************************/
/**
 * @constructor
 * @extends {THREE.Material}
 * @param {!Object=} parameters
 */
THREE.MeshBasicMaterial = function(parameters) {};





/******************************************************************************
 * THREE.Texture
 *****************************************************************************/
/**
 * @constructor
 * @param {!Object=} arg
 */
THREE.Texture = function(arg) {};

/**
 * @type {string}
 */
THREE.Texture.prototype.name;

/**
 * @type {number}
 */
THREE.Texture.prototype.wrapS;

/**
 * @type {number}
 */
THREE.Texture.prototype.wrapT;

/**
 * @type {!THREE.Vector2}
 */
THREE.Texture.prototype.repeat;

/**
 * @type {boolean}
 */
THREE.Texture.prototype.needsUpdate;





/******************************************************************************
 * THREE.Shape
 *****************************************************************************/
/**
 * @constructor
 */
THREE.Shape = function() {};

/**
 * @param  {number} x
 * @param  {number} y
 * @return {void}
 */
THREE.Shape.prototype.moveTo = function(x, y) {};

/**
 * @param  {number} x
 * @param  {number} y
 * @return {void}
 */
THREE.Shape.prototype.lineTo = function(x, y) {};





/******************************************************************************
 * THREE.Geometry
 *****************************************************************************/
/**
 * @constructor
 */
THREE.Geometry = function() {};

/**
 * @type {string}
 */
THREE.Geometry.prototype.name;

/**
 * @type {string}
 */
THREE.Geometry.prototype.type;

/**
 * @type {boolean}
 */
THREE.Geometry.prototype.isGeometry;

/**
 * @param  {!THREE.Geometry} geometry
 * @param  {THREE.Matrix4=} matrix
 * @param  {number=} materialIndexOffset
 * @return {void}
 */
THREE.Geometry.prototype.merge = function(geometry, matrix, materialIndexOffset) {};

/**
 * @return {void}
 */
THREE.Geometry.prototype.dispose = function() {};





/******************************************************************************
 * THREE.PlaneGeometry
 *****************************************************************************/
/**
 * @constructor
 * @extends {THREE.Geometry}
 * @param {number=} width
 * @param {number=} height
 * @param {number=} widthSegments
 * @param {number=} heightSegments
 */
THREE.PlaneGeometry = function(width, height, widthSegments, heightSegments) {};





/******************************************************************************
 * THREE.BoxGeometry
 *****************************************************************************/
/**
 * @constructor
 * @extends {THREE.Geometry}
 * @param {number=} width
 * @param {number=} height
 * @param {number=} depth
 * @param {number=} widthSegments
 * @param {number=} heightSegments
 * @param {number=} depthSegments
 */
THREE.BoxGeometry = function(width, height, depth, widthSegments, heightSegments, depthSegments) {};





/******************************************************************************
 * THREE.SphereGeometry
 *****************************************************************************/
/**
 * @constructor
 * @extends {THREE.Geometry}
 * @param {number} radius
 * @param {number=} widthSegments
 * @param {number=} heightSegments
 * @param {number=} phiStart
 * @param {number=} phiLength
 * @param {number=} thetaStart
 * @param {number=} thetaLength
 */
THREE.SphereGeometry = function(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength) {};





/******************************************************************************
 * THREE.CylinderGeometry
 *****************************************************************************/
/**
 * @constructor
 * @extends {THREE.Geometry}
 * @param {number} radiusTop
 * @param {number} radiusBottom
 * @param {number} height
 * @param {number=} radialSegments
 * @param {number=} heightSegments
 * @param {boolean=} openEnded
 * @param {number=} thetaStart
 * @param {number=} thetaLength
 */
THREE.CylinderGeometry = function(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength) {};





/******************************************************************************
 * THREE.CylinderGeometry
 *****************************************************************************/
/**
 * @constructor
 * @extends {THREE.Geometry}
 * @param {!THREE.Shape} shapes
 * @param {!Object=} options
 */
THREE.ShapeGeometry = function(shapes, options) {};





/******************************************************************************
 * THREE.RingGeometry
 *****************************************************************************/
/**
 * @constructor
 * @extends {THREE.Geometry}
 * @param {number} innerRadius   [description]
 * @param {number=} outerRadius   [description]
 * @param {number=} thetaSegments [description]
 * @param {number=} phiSegments   [description]
 * @param {number=} thetaStart    [description]
 * @param {number=} thetaLength   [description]
 */
THREE.RingGeometry = function(innerRadius, outerRadius, thetaSegments, phiSegments, thetaStart, thetaLength) {};





/******************************************************************************
 * THREE.CircleGeometry
 *****************************************************************************/
/**
 * @constructor
 * @extends {THREE.Geometry}
 * @param {number} radius   [description]
 * @param {number=} segments   [description]
 * @param {number=} thetaStart [description]
 * @param {number=} thetaLength   [description]
 */
THREE.CircleGeometry = function(radius, segments, thetaStart, thetaLength) {};






/******************************************************************************
 * THREE.BufferGeometry
 *****************************************************************************/
/**
 * @constructor
 */
THREE.BufferGeometry = function() {};

/**
 * @type {string}
 */
THREE.BufferGeometry.prototype.name;

/**
 * @type {string}
 */
THREE.BufferGeometry.prototype.type;

/**
 * @type {boolean}
 */
THREE.BufferGeometry.prototype.isBufferGeometry;

/**
 * @param {!THREE.Geometry} geometry
 * @return {void}
 */
THREE.BufferGeometry.prototype.fromGeometry = function(geometry) {};





/******************************************************************************
 * THREE.PlaneBufferGeometry
 *****************************************************************************/
/**
 * @constructor
 * @extends {THREE.BufferGeometry}
 * @param {number=} width
 * @param {number=} height
 * @param {number=} widthSegments
 * @param {number=} heightSegments
 */
THREE.PlaneBufferGeometry = function(width, height, widthSegments, heightSegments) {};





/******************************************************************************
 * THREE.BoxBufferGeometry
 *****************************************************************************/
/**
 * @constructor
 * @extends {THREE.BufferGeometry}
 * @param {number=} width
 * @param {number=} height
 * @param {number=} depth
 * @param {number=} widthSegments
 * @param {number=} heightSegments
 * @param {number=} depthSegments
 */
THREE.BoxBufferGeometry = function(width, height, depth, widthSegments, heightSegments, depthSegments) {};





/******************************************************************************
 * THREE.SphereBufferGeometry
 *****************************************************************************/
/**
 * @constructor
 * @extends {THREE.BufferGeometry}
 * @param {number} radius
 * @param {number=} widthSegments
 * @param {number=} heightSegments
 * @param {number=} phiStart
 * @param {number=} phiLength
 * @param {number=} thetaStart
 * @param {number=} thetaLength
 */
THREE.SphereBufferGeometry = function(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength) {};





/******************************************************************************
 * THREE.CylinderBufferGeometry
 *****************************************************************************/
/**
 * @constructor
 * @extends {THREE.BufferGeometry}
 * @param {number} radiusTop
 * @param {number} radiusBottom
 * @param {number} height
 * @param {number=} radialSegments
 * @param {number=} heightSegments
 * @param {boolean=} openEnded
 * @param {number=} thetaStart
 * @param {number=} thetaLength
 */
THREE.CylinderBufferGeometry = function(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength) {};





/******************************************************************************
 * THREE.RingBufferGeometry
 *****************************************************************************/
/**
 * @constructor
 * @extends {THREE.BufferGeometry}
 * @param {number} innerRadius   [description]
 * @param {number=} outerRadius   [description]
 * @param {number=} thetaSegments [description]
 * @param {number=} phiSegments   [description]
 * @param {number=} thetaStart    [description]
 * @param {number=} thetaLength   [description]
 */
THREE.RingBufferGeometry = function(innerRadius, outerRadius, thetaSegments, phiSegments, thetaStart, thetaLength) {};





/******************************************************************************
 * THREE.CircleBufferGeometry
 *****************************************************************************/
/**
 * @constructor
 * @extends {THREE.BufferGeometry}
 * @param {number} radius   [description]
 * @param {number=} segments   [description]
 * @param {number=} thetaStart [description]
 * @param {number=} thetaLength   [description]
 */
THREE.CircleBufferGeometry = function(radius, segments, thetaStart, thetaLength) {};






/******************************************************************************
 * THREE.Mesh
 *****************************************************************************/
/**
 * @constructor
 * @extends {THREE.Object3D}
 * @param {(THREE.Geometry | THREE.BufferGeometry | undefined)} geometry
 * @param {(THREE.Material | Array<THREE.Material> | undefined)} material
 */
THREE.Mesh = function(geometry, material) {};

/**
 * @type {(!THREE.Geometry | !THREE.BufferGeometry)}
 */
THREE.Mesh.prototype.geometry;

/**
 * @type {(!THREE.Material | !Array<!THREE.Material>)}
 */
THREE.Mesh.prototype.material;






/******************************************************************************
 * THREE.Light
 *****************************************************************************/
/**
 * @constructor
 * @extends {THREE.Object3D}
 * @param {number} color
 * @param {number=} intensity
 */
THREE.Light = function(color, intensity) {};

/**
 * @param {!THREE.Light} other
 * @return {!THREE.Light}
 */
THREE.Light.prototype.copy = function(other) {};





/******************************************************************************
 * THREE.AmbientLight
 *****************************************************************************/
/**
 * @constructor
 * @extends {THREE.Light}
 * @param {number} color
 * @param {number=} intensity
 */
THREE.AmbientLight = function(color, intensity) {};





/******************************************************************************
 * THREE.DirectionalLight
 *****************************************************************************/
/**
 * @constructor
 * @extends {THREE.Light}
 * @param {number} color
 * @param {number=} intensity
 */
THREE.DirectionalLight = function(color, intensity) {};

/**
 * @type {!THREE.Vector3}
 */
THREE.DirectionalLight.prototype.position;

/**
 * @type {!THREE.Object3D}
 */
THREE.DirectionalLight.prototype.target;

/**
 * @type {!THREE.DirectionalLightShadow}
 */
THREE.DirectionalLight.prototype.shadow;





/******************************************************************************
 * THREE.LightShadow
 *****************************************************************************/
/**
 * @constructor
 * @param {!THREE.Camera} light
 */
THREE.LightShadow = function(light) {};

/**
 * @type {!THREE.OrthographicCamera}
 */
THREE.LightShadow.prototype.camera;

/**
 * @type {number}
 */
THREE.LightShadow.prototype.bias;

/**
 * @type {number}
 */
THREE.LightShadow.prototype.radius;

/**
 * @type {!THREE.Vector2}
 */
THREE.LightShadow.prototype.mapSize;

/**
 * @type {!THREE.Matrix4}
 */
THREE.LightShadow.prototype.matrix;





/******************************************************************************
 * THREE.DirectionalLightShadow
 *****************************************************************************/
/**
 * @constructor
 * @extends {THREE.LightShadow}
 * @param {!THREE.Light} light
 */
THREE.DirectionalLightShadow = function(light) {};






/******************************************************************************
 * THREE.Camera
 *****************************************************************************/
/**
 * @constructor
 * @extends {THREE.Object3D}
 */
THREE.Camera = function() {};

/**
 * @type {string}
 */
THREE.Camera.prototype.type;

/**
 * @type {!THREE.Matrix4}
 */
THREE.Camera.prototype.matrixWorldInverse;

/**
 * @type {!THREE.Matrix4}
 */
THREE.Camera.prototype.projectionMatrix;

/**
 * @param {!THREE.Vector3} vector
 * @return {void}
 */
THREE.Camera.prototype.lookAt = function(vector) {};

/**
 * @return {void}
 */
THREE.Camera.prototype.updateProjectionMatrix = function() {};






/******************************************************************************
 * THREE.PerspectiveCamera
 *****************************************************************************/
/**
 * @constructor
 * @extends {THREE.Camera}
 * @param {number} fov
 * @param {number} aspect
 * @param {number} near
 * @param {number} far
 */
THREE.PerspectiveCamera = function(fov, aspect, near, far) {};

/**
 * @type {number}
 */
THREE.PerspectiveCamera.prototype.fov;

/**
 * @type {number}
 */
THREE.PerspectiveCamera.prototype.aspect;

/**
 * @type {number}
 */
THREE.PerspectiveCamera.prototype.near;

/**
 * @type {number}
 */
THREE.PerspectiveCamera.prototype.far;






/******************************************************************************
 * THREE.OrthographicCamera
 *****************************************************************************/
/**
 * @constructor
 * @extends {THREE.Camera}
 * @param {number} left
 * @param {number} right
 * @param {number} top
 * @param {number} bottom
 * @param {number} near
 * @param {number} far
 */
THREE.OrthographicCamera = function(left, right, top, bottom, near, far) {};

/**
 * @type {number}
 */
THREE.OrthographicCamera.prototype.left;

/**
 * @type {number}
 */
THREE.OrthographicCamera.prototype.right;

/**
 * @type {number}
 */
THREE.OrthographicCamera.prototype.top;

/**
 * @type {number}
 */
THREE.OrthographicCamera.prototype.bottom;

/**
 * @type {number}
 */
THREE.OrthographicCamera.prototype.near;

/**
 * @type {number}
 */
THREE.OrthographicCamera.prototype.far;






/******************************************************************************
 * THREE.LoadingManager
 *****************************************************************************/
/**
 * @constructor
 * @param {Function=} onLoad
 * @param {Function=} onProgress
 * @param {Function=} onError
 */
THREE.LoadingManager = function(onLoad, onProgress, onError) {};

/**
 * @type {?Function | undefined}
 */
THREE.LoadingManager.prototype.onStart;

/**
 * @type {?Function | undefined}
 */
THREE.LoadingManager.prototype.onLoad;

/**
 * @type {?Function | undefined}
 */
THREE.LoadingManager.prototype.onProgress;

/**
 * @type {?Function | undefined}
 */
THREE.LoadingManager.prototype.onError;






/******************************************************************************
 * THREE.FileLoader
 *****************************************************************************/
/**
 * @constructor
 * @param {THREE.LoadingManager=} manager
 */
THREE.FileLoader = function(manager) {};


/**
 * @param  {string} url
 * @param  {Function} onLoad
 * @param  {Function=} onProgress
 * @param  {Function=} onError
 * @return {XMLHttpRequest | string} the request object or the cached result
 */
THREE.FileLoader.prototype.load = function(url, onLoad, onProgress, onError) {};






/******************************************************************************
 * THREE.ObjectLoader
 *****************************************************************************/
/**
 * @constructor
 * @param {THREE.LoadingManager=} manager
 */
THREE.ObjectLoader = function(manager) {};


/**
 * @param  {string} url
 * @param  {Function} onLoad
 * @param  {Function=} onProgress
 * @param  {Function=} onError
 * @return {XMLHttpRequest | string} the request object or the cached result
 */
THREE.ObjectLoader.prototype.load = function(url, onLoad, onProgress, onError) {};

/**
 * @param  {*} json
 * @return {!Object<string, (!THREE.Geometry | !THREE.BufferGeometry)>}
 */
THREE.ObjectLoader.prototype.parseGeometries = function(json) {};






/******************************************************************************
 * THREE.TextureLoader
 *****************************************************************************/
/**
 * @constructor
 * @param {THREE.LoadingManager=} manager
 */
THREE.TextureLoader = function(manager) {};


/**
 * @param  {string} url
 * @param  {Function=} onLoad
 * @param  {Function=} onProgress
 * @param  {Function=} onError
 * @return {!THREE.Texture}
 */
THREE.TextureLoader.prototype.load = function(url, onLoad, onProgress, onError) {};






/******************************************************************************
 * THREE.JSONLoader
 *****************************************************************************/
/**
 * @constructor
 * @param {THREE.LoadingManager=} manager
 */
THREE.JSONLoader = function(manager) {};


/**
 * @param  {string} url
 * @param  {Function=} onLoad
 * @param  {Function=} onProgress
 * @param  {Function=} onError
 * @return {!THREE.Texture}
 */
THREE.JSONLoader.prototype.load = function(url, onLoad, onProgress, onError) {};

/**
 * @param  {!Object} json
 * @param  {string=} texturePath
 * @return {!THREE.Object3D}
 */
THREE.JSONLoader.prototype.parse = function(json, texturePath) {};






/******************************************************************************
 * THREE.WebGLRenderer
 *****************************************************************************/
/**
 * @constructor
 * @param {!Object=} params
 */
THREE.WebGLRenderer = function(params) {};

/**
 * @type {!THREE.WebGLShadowMap}
 */
THREE.WebGLRenderer.prototype.shadowMap;

/**
 * @type {!Element}
 */
THREE.WebGLRenderer.prototype.domElement;

/**
 * @type {!Object}
 */
THREE.WebGLRenderer.prototype.info;


/**
 * @param  {number} width
 * @param  {number} height
 * @return {void}
 */
THREE.WebGLRenderer.prototype.setSize = function(width, height) {};


/**
 * @return {!{width: number, height: number}}
 */
THREE.WebGLRenderer.prototype.getSize = function() {};


/**
 * @param  {!THREE.Scene} scene
 * @param  {!THREE.Camera} camera
 * @param  {?THREE.WebGLRenderTarget=} renderTarget
 * @param  {boolean=} forceClear
 * @return {void}
 */
THREE.WebGLRenderer.prototype.render = function(scene, camera, renderTarget, forceClear) {};






/******************************************************************************
 * THREE.WebGLRenderTarget
 *****************************************************************************/
/**
 * @constructor
 * @param {number=} width
 * @param {number=} height
 * @param {!Object=} options
 */
THREE.WebGLRenderTarget = function(width, height, options) {};

/**
 * @type {number}
 */
THREE.WebGLRenderTarget.prototype.width;

/**
 * @type {number}
 */
THREE.WebGLRenderTarget.prototype.height;






/******************************************************************************
 * THREE.WebGLShadowMap
 *****************************************************************************/
/**
 * @constructor
 */
THREE.WebGLShadowMap = function() {};

/**
 * @type {boolean}
 */
THREE.WebGLShadowMap.prototype.enabled;

/**
 * @type {number}
 */
THREE.WebGLShadowMap.prototype.type;






/******************************************************************************
 * THREE.Clock
 *****************************************************************************/
/**
 * @constructor
 * @param {boolean=} autostart
 */
THREE.Clock = function(autostart) {};

/**
 * @type {boolean}
 */
THREE.Clock.prototype.autoStart;

/**
 * @type {number}
 */
THREE.Clock.prototype.startTime;

/**
 * @type {number}
 */
THREE.Clock.prototype.oldTime;

/**
 * @type {number}
 */
THREE.Clock.prototype.elapsedTime;

/**
 * @type {boolean}
 */
THREE.Clock.prototype.running;

/**
 * @return {void}
 */
THREE.Clock.prototype.start = function() {};

/**
 * @return {void}
 */
THREE.Clock.prototype.stop = function() {};

/**
 * @return {number}
 */
THREE.Clock.prototype.getElapsedTime = function() {};

/**
 * @return {number}
 */
THREE.Clock.prototype.getDelta = function() {};
