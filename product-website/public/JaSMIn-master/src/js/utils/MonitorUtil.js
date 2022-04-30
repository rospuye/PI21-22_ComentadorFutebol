/**
 *
 * @author Stefan Glaser
 */
class MonitorUtil
{
  /**
   * The copyString funcion presents a workaround for deep copying partial strings.
   *
   * Modern browsers only provide partial strings when using string.substring() / .slice() / etc.
   * while keeping a reference to the original string. While this usually improves the overall
   * performance and memory consumption, it also prevents the garbage collector from collecting
   * the original string. This function provides a workaround for really copying a string value
   * (obtained via .substring() / .slice() / etc.).
   * Use this function when storing partial strings in your result objects.
   *
   * @param  {string} partialString
   * @return {string} a "deep" copy of the above partial string
   */
  static copyString (partialString)
  {
    if (partialString) {
      return /** @type {string} */ (JSON.parse(JSON.stringify(partialString)));
    }

    return partialString;
  }
}

export { MonitorUtil };
