/**
 * Simple persistance helpers.
 *
 * @author Stefan Glaser
 */
class Persistance
{
  /**
   * Store the given value under the given key in the local storage.
   *
   * @param  {string} key the storage item key
   * @param  {string | boolean} value the item value
   * @return {void}
   */
  static storeItem (key, value)
  {
    localStorage.setItem(key, value);
  }

  /**
   * Read an item from the local storage with the given key.
   *
   * @param  {string} key the storage item key
   * @return {?string} the stored value for the given key, or null if no such value exists
   */
  static readItem (key)
  {
    return localStorage.getItem(key);
  }

  /**
   * Read a boolean from local storage.
   *
   * @param  {string} key the key
   * @param  {string} defaultVal the defaultVal value if no value for the given key was specified
   * @return {string}
   */
  static readString (key, defaultVal)
  {
    const item = localStorage.getItem(key);

    if (item !== null) {
      return item;
    }

    return defaultVal;
  }

  /**
   * Read a boolean from local storage.
   *
   * @param  {string} key the key
   * @param  {boolean} defaultVal the defaultVal value if no value for the given key was specified
   * @return {boolean}
   */
  static readBoolean (key, defaultVal)
  {
    const item = localStorage.getItem(key);

    if (item !== null) {
      return item == 'true';
    }

    return defaultVal;
  }
}

export { Persistance };