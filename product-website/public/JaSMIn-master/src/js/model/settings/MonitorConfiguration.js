import { ConfigurationModel } from './ConfigurationModel.js';


/**
 * The monitor configuration event type enum.
 * @enum {string}
 */
export const MonitorConfigurationEvents = {
  CHANGE: 'change'
};

/**
 * The monitor configuration property enum.
 * @enum {string}
 */
export const MonitorConfigurationProperties = {
  TEAM_COLORS_ENABLED: 'teamColorsEnabled',
  TEAM_COLOR_LEFT: 'teamColorLeft',
  TEAM_COLOR_RIGHT: 'teamColorRight',
  INTERPOLATE_STATES: 'interpolateStates',
  SHADOWS_ENABLED: 'shadowsEnabled',
  GL_INFO_ENABLED: 'glInfoEnabled'
};

/**
 * The MonitorConfiguration class definition.
 *
 * The MonitorConfiguration provides
 *
 * @author Stefan Glaser
 */
class MonitorConfiguration extends ConfigurationModel
{
  /**
   * MonitorConfiguration Constructor
   *
   * ::implements {IPublisher}
   * ::implements {IEventDispatcher}
   * ::implements {IConfiguration}
   */
  constructor()
  {
    super();

    /**
     * Use user defined team colors?
     * @type {boolean}
     */
    this.teamColorsEnabled = false;

    /**
     * User defined color for the left team.
     * @type {!THREE.Color}
     */
    this.leftTeamColor = new THREE.Color('#cccc00');

    /**
     * User defined color for the right team.
     * @type {!THREE.Color}
     */
    this.rightTeamColor = new THREE.Color('#008fff');

    /**
     * Interpolate world states?
     * @type {boolean}
     */
    this.interpolateStates = true;

    /**
     * Are shadows enabled?
     * @type {boolean}
     */
    this.shadowsEnabled = false;

    /**
     * Show gl panel info?
     * @type {boolean}
     */
    this.glInfoEnabled = false;
  }

  /**
   * @override
   * @return {string}
   */
  getID ()
  {
    return 'monitorConfig';
  }

  /**
   * @override
   * @return {string}
   */
  toJSONString ()
  {
    const obj = {};

    // Store properties
    obj[MonitorConfigurationProperties.TEAM_COLORS_ENABLED] = this.teamColorsEnabled;
    obj[MonitorConfigurationProperties.TEAM_COLOR_LEFT] = this.leftTeamColor.getHex();
    obj[MonitorConfigurationProperties.TEAM_COLOR_RIGHT] = this.rightTeamColor.getHex();
    obj[MonitorConfigurationProperties.INTERPOLATE_STATES] = this.interpolateStates;
    obj[MonitorConfigurationProperties.SHADOWS_ENABLED] = this.shadowsEnabled;
    obj[MonitorConfigurationProperties.GL_INFO_ENABLED] = this.glInfoEnabled;

    return JSON.stringify(obj);
  }

  /**
   * Restore this configuration from persistance string.
   *
   * @override
   * @param  {string} jsonString a stringified version of this configuration
   * @return {void}
   */
  fromJSONString (jsonString)
  {
    try {
      const obj = JSON.parse(jsonString);

      // Read values
      let value = obj[MonitorConfigurationProperties.TEAM_COLORS_ENABLED];
      if (value !== undefined) {
        this.teamColorsEnabled = value;
      }

      value = obj[MonitorConfigurationProperties.TEAM_COLOR_LEFT];
      if (value !== undefined) {
        this.leftTeamColor = new THREE.Color(value);
      }

      value = obj[MonitorConfigurationProperties.TEAM_COLOR_RIGHT];
      if (value !== undefined) {
        this.rightTeamColor = new THREE.Color(value);
      }

      value = obj[MonitorConfigurationProperties.INTERPOLATE_STATES];
      if (value !== undefined) {
        this.interpolateStates = value;
      }

      value = obj[MonitorConfigurationProperties.SHADOWS_ENABLED];
      if (value !== undefined) {
        this.shadowsEnabled = value;
      }

      value = obj[MonitorConfigurationProperties.GL_INFO_ENABLED];
      if (value !== undefined) {
        this.glInfoEnabled = value;
      }
    } catch (ex) {
      console.log(ex);
    }
  }

  /**
   * Enable/Disable usage of user defined team colors.
   *
   * @param {boolean} value true for enabled, false for disabled
   * @return {void}
   */
  setTeamColorsEnabled (value)
  {
    if (this.teamColorsEnabled !== value) {
      this.teamColorsEnabled = value;

      // Publish change event
      this.dispatchEvent({
        type: MonitorConfigurationEvents.CHANGE,
        property: MonitorConfigurationProperties.TEAM_COLORS_ENABLED,
        newValue: value
      });
    }
  }

  /**
   * Store the given color as the user defined color for the left team.
   *
   * @param {string} color the user defined team color
   * @param {boolean} leftSide true if the color is for the left team, false for the right team
   * @return {void}
   */
  setTeamColor (color, leftSide)
  {
    if (leftSide) {
      this.leftTeamColor = new THREE.Color(color);

      // Publish change event
      this.dispatchEvent({
        type: MonitorConfigurationEvents.CHANGE,
        property: MonitorConfigurationProperties.TEAM_COLOR_LEFT,
        newValue: this.leftTeamColor
      });
    } else {
      this.rightTeamColor = new THREE.Color(color);

      // Publish change event
      this.dispatchEvent({
        type: MonitorConfigurationEvents.CHANGE,
        property: MonitorConfigurationProperties.TEAM_COLOR_RIGHT,
        newValue: this.rightTeamColor
      });
    }
  }

  /**
   * Read the user defined color for a team.
   *
   * @param  {boolean} leftSide true for left side, false for right side
   * @return {!THREE.Color} the user defined team color
   */
  getTeamColor (leftSide)
  {
    return leftSide ? this.leftTeamColor : this.rightTeamColor;
  }

  /**
   * @param {boolean} value
   */
  setInterpolateStates (value)
  {
    if (this.interpolateStates !== value) {
      this.interpolateStates = value;

      // Publish change event
      this.dispatchEvent({
        type: MonitorConfigurationEvents.CHANGE,
        property: MonitorConfigurationProperties.INTERPOLATE_STATES,
        newValue: value
      });
    }
  }

  /**
   * @param {boolean} value
   */
  setShadowsEnabled (value)
  {
    if (this.shadowsEnabled !== value) {
      this.shadowsEnabled = value;

      // Publish change event
      this.dispatchEvent({
        type: MonitorConfigurationEvents.CHANGE,
        property: MonitorConfigurationProperties.SHADOWS_ENABLED,
        newValue: value
      });
    }
  }

  /**
   * @param {boolean} value
   */
  setGLInfoEnabled (value)
  {
    if (this.glInfoEnabled !== value) {
      this.glInfoEnabled = value;

      // Publish change event
      this.dispatchEvent({
        type: MonitorConfigurationEvents.CHANGE,
        property: MonitorConfigurationProperties.GL_INFO_ENABLED,
        newValue: value
      });
    }
  }
}

export { MonitorConfiguration };
