import { EventDispatcher } from '../../utils/EventDispatcher.js';

/**
 * Base class for all configuration models.
 *
 * @author Stefan Glaser
 */
class ConfigurationModel extends EventDispatcher
{
  constructor ()
  {
    super();
  }

  /**
   * Retrieve the configuration id.
   *
   * @return {string} the configuration id
   */
  getID ()
  {
    return '';
  }

  /**
   * Retrieve a stringified version of this configuration for persistance.
   *
   * @return {string} the stringified version of this configuration
   */
  toJSONString ()
  {
    return '';
  }

  /**
   * Restore this configuration from persistance string.
   *
   * @param  {string} jsonString a stringified version of this configuration
   * @return {void}
   */
  fromJSONString (jsonString) {}
}

export { ConfigurationModel };
