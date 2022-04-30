/**
 * Geometry factory interface.
 * 
 * @author Stefan Glaser
 */
class GeometryFactory
{
  /**
   * Create the geometry with the given name.
   *
   * @param  {string} name the unique name of the geometry
   * @param  {!Function} onLoad the callback function to call on successfull creation
   * @param  {!Function=} onError the callback function to call when creating the geometry failed
   * @return {void}
   */
  createGeometry (name, onLoad, onError) {}
}

export { GeometryFactory };
