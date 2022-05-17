import { GeometryFactory } from './GeometryFactory.js';

class JSONGeometryFactoryRequest
{
  /**
   * Helper class for storing geometry requests while the resource file is still loading.
   *
   * @param {string} name the name of the requested geometry
   * @param {!Function} onLoad the onLoad callback
   * @param {!Function=} onError the onError callback
   */
  constructor (name, onLoad, onError)
  {
    /**
     * The name of the requested geometry.
     * @type {string}
     */
    this.name = name;

    /**
     * The onLoad callback.
     * @type {!Function}
     */
    this.onLoad = onLoad;

    /**
     * The onError callback.
     * @type {(!Function | undefined)}
     */
    this.onError = onError;
  }
}

export { JSONGeometryFactoryRequest };



class JSONGeometryFactory extends GeometryFactory
{
  /**
   * @param {string} resourceFile the json resource file containing a geometry array
   */
  constructor (resourceFile)
  {
    super();
    
    /**
     * The json resource file.
     * @type {string}
     */
    this.resourceFile = resourceFile;

    /**
     * The list of loaded geometries.
     * @type {!Array<!THREE.BufferGeometry>}
     */
    this.geometries = [];

    /**
     * An array holding the create requests while the factory is still loading.
     * @type {!Array<!JSONGeometryFactoryRequest>}
     */
    this.requestCache = [];

    /**
     * Flag for indicating if the factory is currently loading the resource file.
     * @type {boolean}
     */
    this.loading = false;

    /**
     * Flag for indicating if the factory resource file was loaded.
     * @type {boolean}
     */
    this.loaded = false;
  }

  /**
   * Load the json resource file.
   *
   * @return {void}
   */
  loadJSON ()
  {
    if (this.loaded || this.loading) {
      return;
    }

    this.loading = true;

    const scope = this;
    const fileLoader = new THREE.FileLoader();

    fileLoader.load(this.resourceFile,
      function(json) {
        const objectLoader = new THREE.ObjectLoader();
        const loadedGeometries = objectLoader.parseGeometries(JSON.parse(json));

        for (const key in loadedGeometries) {
          const geometry = loadedGeometries[key];

          if (geometry.isGeometry !== undefined && geometry.isGeometry === true) {
            const bufferGeo = new THREE.BufferGeometry();
            bufferGeo.fromGeometry(/** @type {!THREE.Geometry} */ (geometry));
            bufferGeo.name = geometry.name;
            scope.geometries.push(bufferGeo);

            // Dispose source geometry after copy
            geometry.dispose();
          } else if (geometry.isBufferGeometry !== undefined && geometry.isBufferGeometry === true) {
            scope.geometries.push(/** @type {!THREE.BufferGeometry} */ (geometry));
          }
        }

        // Set flags
        scope.loaded = true;
        scope.loading = false;

        // Serve cached geometry requests
        scope.serveCachedRequests();
      },
      undefined,
      function(xhr) {
        // Set flags
        scope.loaded = true;
        scope.loading = false;

        // Notify cached geometry requests about failure
        scope.serveCachedRequests();

        console.error('Failed to load GeometryFactory resource file: "' + scope.resourceFile + '"!');
      });
  }

  /**
   * Serve all cached requests.
   *
   * @return {void}
   */
  serveCachedRequests ()
  {
    let i = this.requestCache.length;
    let request;
    while (i--) {
      request = this.requestCache[i];
      this.createGeometry(request.name, request.onLoad, request.onError);
    }

    // Clear cached requests
    this.requestCache.length = 0;
  }

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
    // Check if the resource file was loaded before
    if (this.loaded) {
      // The resource file is already loaded, so directly call onLoad/onError
      let i = this.geometries.length;
      while (i--) {
        if (this.geometries[i].name === name) {
          onLoad(this.geometries[i]);
          return;
        }
      }

      // Log error
      console.log('Geometry "' + name + '" not found!');

      // The requested geometry is not part of the resource file, report error
      if (onError) {
        onError('Geometry "' + name + '" not found!');
      }
    } else {
      // The resource file is not loaded yet, so check if we need to trigger loading it
      if (!this.loading) {
        this.loadJSON();
      }

      // While the resource file is loading, we need to remember the request and serve it later
      this.requestCache.push(new JSONGeometryFactoryRequest(name, onLoad, onError));
    }
  }
}

export { JSONGeometryFactory };
