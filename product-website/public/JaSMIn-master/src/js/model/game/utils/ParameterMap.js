/**
 * The ParameterMap class definition.
 *
 * The ParameterMap provides
 *
 * @author Stefan Glaser / http://chaosscripting.net
 */
class ParameterMap
{
  /**
   * ParameterMap Constructor
   *
   * @param {!Object=} params the parameter object.
   */
  constructor(params)
  {
    /**
     * The parameter object.
     * @type {!Object}
     */
    this.paramObj = params !== undefined ? params : {};
  }

  /**
   * Clear this parameter map.
   *
   * @return {void}
   */
  clear ()
  {
    this.paramObj = {};
  }

  /**
   * Fetch a number parameter with the given key.
   * This method will return null if:
   * - the key is invalid (undefined)
   * - the value with the given key is not a number
   *
   * @param {string | number} key the key of interest
   * @return {?number}
   */
  getNumber (key)
  {
    const value = this.paramObj[key];

    if (typeof value === 'number') {
      return value;
    }

    return null;
  }

  /**
   * Fetch a boolean parameter with the given key.
   * This method will return null if:
   * - the key is invalid (undefined)
   *
   * @param {string | number} key the key of interest
   * @return {?boolean}
   */
  getBoolean (key)
  {
    const value = this.paramObj[key];

    if (value !== undefined) {
      return value ? true : false;
    }

    return null;
  }

  /**
   * Fetch a string parameter with the given key.
   * This method will return null if:
   * - the key is invalid (undefined)
   * - the value with the given key is not a string
   *
   * @param {string | number} key the key of interest
   * @return {?string}
   */
  getString (key)
  {
    const value = this.paramObj[key];

    if (typeof value === 'string') {
      return value;
    }

    return null;
  }

  /**
   * Fetch a new parameter wrapper object for the object with the given key.
   * This method will return null if:
   * - the key is invalid (undefined)
   * - the value with the given key is not an object
   *
   * @param {string | number} key the key of interest
   * @return {?ParameterMap}
   */
  getObject (key)
  {
    const value = this.paramObj[key];

    if (typeof value === 'object') {
      return new ParameterMap(/** @type {!Object} */ (value));
    }

    return null;
  }
}

export { ParameterMap };
