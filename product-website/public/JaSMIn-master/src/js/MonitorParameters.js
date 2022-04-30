/**
 * Class for parsing and holding monitor parameters.
 *
 * @author Stefan Glaser
 */
class MonitorParameters
{
  /**
   * MonitorParameter Constructor
   *
   * @param {?Object=} params the external monitor parameter object
   */
  constructor (params)
  {
    /**
     * The monitor parameter object.
     * @type {!Object}
     */
    this.monitorParams = (params !== undefined && params !== null) ? params : {};

    /**
     * The query parameter object.
     * @type {!Object}
     */
    this.queryParams = MonitorParameters.parseQueryParams();
  }

  /**
   * Retrieve a query parameter.
   *
   * @param  {string} key the parameter key
   * @return {?string} the query parameter if specified, or null otherwise
   */
  getQueryParam (key)
  {
    if (this.queryParams[key]) {
      return this.queryParams[key];
    }

    return null;
  }

  /**
   * Check for embedded parameter.
   *
   * @return {boolean} true, if embedded mode is set and true, false otherwise
   */
  isEmbedded ()
  {
    return this.monitorParams['embedded'] === true;
  }

  /**
   * Retrieve archives parameter.
   *
   * @return {!Array<{url: string, name: string}>} the list of predefined archive locations
   */
  getArchives ()
  {
    if (this.monitorParams['archives']) {
      return this.monitorParams['archives'];
    }

    return [];
  }

  /**
   * Retrieve the game log / replay url parameter.
   *
   * @return {?string} the game log url if specified, or null otherwise
   */
  getGameLogURL ()
  {
    let url = this.getQueryParam('gamelog');

    if (url === null) {
      // Alternatively check for "replay" parameter
      url = this.getQueryParam('replay');
    }

    return url;
  }

  /**
   * Retrieve the playlist url parameter.
   *
   * @return {?string} the playlist url if specified, or null otherwise
   */
  getPlaylistURL ()
  {
    return this.getQueryParam('list');
  }

  /**
   * Extract the query parameters from a query string or the current location.
   *
   * @param  {string=} query the query string to parse or undefined for window.location.search
   * @return {!Object<string,string>} the query parameter map
   */
  static parseQueryParams (query)
  {
    if (query === undefined) {
      query = window.location.search;
    }

    const regex = /[?&]?([^=]+)=([^&]*)/g;
    const params = {};
    let tokens;

    query = query.split('+').join(' ');

    while (tokens = regex.exec(query)) {
      params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }

    return params;
  }
}

export { MonitorParameters };
