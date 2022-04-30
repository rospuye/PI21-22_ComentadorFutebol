import { EventDispatcher } from '../../utils/EventDispatcher.js';
import { MonitorConfiguration } from './MonitorConfiguration.js';
import { ConfigurationModel } from './ConfigurationModel.js';


/**
 * The monitor settings event type enum.
 * @enum {string}
 */
 export const MonitorSettingsEvents = {
  CHANGE: 'change'
};



/**
 * The MonitorSettings class definition.
 *
 * The MonitorSettings provides access to all configuration objects.
 *
 * @author Stefan Glaser
 */
class MonitorSettings extends EventDispatcher
{
  /**
   * MonitorSettings Constructor
   *
   * ::implements {IPublisher}
   * ::implements {IEventDispatcher}
   */
  constructor ()
  {
    super();

    /**
     * The remember configurations settings list.
     * @type {!Object<boolean>}
     */
    this.rememberMap = {};

    /**
     * The remember all configurations indicator.
     * @type {boolean}
     */
    this.rememberAll = false;

    /**
     * The general monitor configuration.
     * @type {!MonitorConfiguration}
     */
    this.monitorConfig = new MonitorConfiguration();


    // Restore user configuration from local storage
    this.restore();
  }

  /**
   * Restore the user configurations from local storage.
   *
   * @return {void}
   */
  restore ()
  {
    // console.log('Restoring settings...');

    // Restore remember all setting
    let value = localStorage.getItem('rememberAll');
    if (value) {
      // console.log('Found rememberAll value: ' + value);
      this.rememberAll = value === 'true';
    }

    // Restore remember map
    value = localStorage.getItem('rememberMap');
    if (value) {
      // console.log('Found rememberMap value: ' + value);
      try {
        this.rememberMap = /** @type {!Object<boolean>} */ (JSON.parse(value));
      } catch (ex) {
        console.log('Exception parsing remember map!');
        console.log(ex);
      }
    }

    // restore individual configs
    this.restoreConfig(this.monitorConfig);
  }

  /**
   * Restore the specified user configuration from local storage.
   *
   * @param {!ConfigurationModel} config the config to restore
   * @return {void}
   */
  restoreConfig (config)
  {
    const value = localStorage.getItem(config.getID());

    if (value) {
      // Found valid configuration value
       config.fromJSONString(value);
    }
  }

  /**
   * Save/Store the user configurations to the local storage.
   *
   * @return {void}
   */
  save ()
  {
    // console.log('Saving settings...');

    // Save configuration remembering settings
    localStorage.setItem('rememberAll', this.rememberAll);
    localStorage.setItem('rememberMap', JSON.stringify(this.rememberMap));

    // Save individual configs
    this.saveConfig(this.monitorConfig);
  }

  /**
   * Save/Store the specified user configuration to the local storage.
   *
   * @param {!ConfigurationModel} config the config to save/store
   * @return {void}
   */
  saveConfig (config)
  {
    const id = config.getID();
    if (this.rememberAll || this.rememberMap[id]) {
      localStorage.setItem(id, config.toJSONString());
    } else {
      localStorage.removeItem(id);
    }
  }

  /**
   * Enable/Disable remember setting for a specific configuration.
   *
   * @param {!ConfigurationModel} config the configuration in question
   * @param {boolean} remember true if the specified config should be stored in the local storage, false otherwise
   * @return {void}
   */
  setRememberConfig (config, remember)
  {
    this.rememberMap[config.getID()] = remember;

    // Publish change event
    this.dispatchEvent({
        type: MonitorSettingsEvents.CHANGE
      });
  }

  /**
   * Enable/Disable remember setting for a all configurations.
   *
   * @param {boolean} remember true if all configurations should be stored in the local storage, false otherwise
   * @return {void}
   */
  setRememberAll (remember)
  {
    this.rememberAll = remember;

    // Publish change event
    this.dispatchEvent({
        type: MonitorSettingsEvents.CHANGE
      });
  }
}

export { MonitorSettings };
